import { access, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { writeFileSafe } from "../utils/file";
import { logger } from "../utils/logger";
import { toKebabCase, toPascalCase } from "../utils/string";
import { findWorkspaceAppNames, findWorkspaceRoot } from "../utils/workspace";

interface GenerateEntityParams {
  name: string;
  args: string[];
  cwd?: string;
}

interface EntityGeneratorOptions {
  app: string;
  domain: string;
  name: string;
}

interface ParsedFlag {
  key: string;
  value: string | true;
}

const supportedFlags = new Set(["app", "domain"]);

function parseFlag(value: string, nextValue: string | undefined): ParsedFlag {
  if (!value.startsWith("--")) {
    throw new Error(`[entity] invalid option format: ${value}`);
  }

  const normalized = value.slice(2);
  const [key, inlineValue] = normalized.split("=");

  if (!key) {
    throw new Error(`[entity] invalid option name: ${value}`);
  }

  if (!supportedFlags.has(key)) {
    throw new Error(`[entity] unsupported option: --${key}`);
  }

  if (inlineValue !== undefined) {
    return {
      key,
      value: inlineValue,
    };
  }

  if (!nextValue || nextValue.startsWith("--")) {
    return {
      key,
      value: true,
    };
  }

  return {
    key,
    value: nextValue,
  };
}

function parseOptions(params: GenerateEntityParams): EntityGeneratorOptions {
  const { name, args } = params;

  const flags = new Map<string, string | true>();

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];

    if (!current) {
      continue;
    }

    const next = args[index + 1];
    const parsed = parseFlag(current, next);

    flags.set(parsed.key, parsed.value);

    if (parsed.value !== true && parsed.value === next) {
      index += 1;
    }
  }

  const rawApp = flags.get("app");
  const rawDomain = flags.get("domain");

  if (typeof rawApp !== "string") {
    throw new Error("[entity] --app is required. Example: --app admin");
  }

  if (typeof rawDomain !== "string") {
    throw new Error("[entity] --domain is required. Example: --domain order");
  }

  const entityName = toKebabCase(name);
  const app = toKebabCase(rawApp);
  const domain = toKebabCase(rawDomain);

  if (!entityName) {
    throw new Error("[entity] entity name is invalid.");
  }

  if (!app) {
    throw new Error("[entity] app name is invalid.");
  }

  if (!domain) {
    throw new Error("[entity] domain name is invalid.");
  }

  return {
    app,
    domain,
    name: entityName,
  };
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);

    return true;
  } catch {
    return false;
  }
}

async function readTextFileOrEmpty(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return "";
    }

    throw error;
  }
}

function extractRuntimeExportNames(content: string): string[] {
  const exportNames = new Set<string>();

  const pattern = /export\s*\{([\s\S]*?)\}\s*from\s*["'][^"']+["'];?/g;

  for (const match of content.matchAll(pattern)) {
    const rawSpecifiers = match[1];

    if (!rawSpecifiers) {
      continue;
    }

    for (const rawSpecifier of rawSpecifiers.split(",")) {
      const specifier = rawSpecifier.trim();

      if (!specifier || specifier.startsWith("type ")) {
        continue;
      }

      const aliasParts = specifier.split(/\s+as\s+/);
      const exportName = aliasParts.at(-1)?.trim();

      if (exportName) {
        exportNames.add(exportName);
      }
    }
  }

  return [...exportNames].sort((a, b) => a.localeCompare(b));
}

function createNamedExportStatement(exportNames: string[], modulePath: string): string {
  return `export { ${exportNames.join(", ")} } from "${modulePath}";`;
}

async function syncEntityUiIndex(uiDirectory: string): Promise<void> {
  const entries = await readdir(uiDirectory, {
    withFileTypes: true,
  });

  const componentDirectories = entries
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  const lines: string[] = [];

  for (const componentDirectory of componentDirectories) {
    const componentIndexPath = path.join(uiDirectory, componentDirectory.name, "index.ts");

    if (!(await exists(componentIndexPath))) {
      continue;
    }

    const componentIndexContent = await readFile(componentIndexPath, "utf8");

    const exportNames = extractRuntimeExportNames(componentIndexContent);

    if (exportNames.length === 0) {
      continue;
    }

    lines.push(createNamedExportStatement(exportNames, `./${componentDirectory.name}`));
  }

  const uiIndexPath = path.join(uiDirectory, "index.ts");

  await writeFile(uiIndexPath, `${lines.join("\n")}\n`);

  logger.info("entity.ui_export.updated", {
    path: uiIndexPath,
  });
}

async function syncEntityDomainIndex(params: {
  domainIndexPath: string;
  uiIndexPath: string;
}): Promise<void> {
  const { domainIndexPath, uiIndexPath } = params;

  const uiIndexContent = await readFile(uiIndexPath, "utf8");

  const exportNames = extractRuntimeExportNames(uiIndexContent);

  if (exportNames.length === 0) {
    return;
  }

  const exportStatement = createNamedExportStatement(exportNames, "./ui");

  const existingContent = await readTextFileOrEmpty(domainIndexPath);

  const uiExportPattern = /export\s+(?:\*\s+|\{[\s\S]*?\}\s+)from\s*["']\.\/ui["'];?/g;

  let replaced = false;

  const nextContent = existingContent.replace(uiExportPattern, () => {
    if (replaced) {
      return "";
    }

    replaced = true;

    return exportStatement;
  });

  const normalizedContent = replaced
    ? nextContent
    : [existingContent.trimEnd(), exportStatement].filter(Boolean).join("\n\n");

  const finalContent = normalizedContent.replace(/\n{3,}/g, "\n\n").trim();

  await writeFile(domainIndexPath, `${finalContent}\n`);

  logger.info("entity.domain_export.updated", {
    path: domainIndexPath,
  });
}

function createComponentTemplate(params: { componentName: string }): string {
  const { componentName } = params;

  return `import type { HTMLAttributes } from "react";

type ${componentName}Props = HTMLAttributes<HTMLDivElement>;

export default function ${componentName}({
  children,
  ...props
}: ${componentName}Props) {
  return <div {...props}>{children}</div>;
}
`;
}

function createTestTemplate(params: { componentName: string; entityName: string }): string {
  const { componentName, entityName } = params;

  return `import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ${componentName} from "./${entityName}";

describe("${componentName}", () => {
  it("children을 렌더링한다", () => {
    render(<${componentName}>Content</${componentName}>);

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("HTML 속성을 전달한다", () => {
    render(
      <${componentName} data-testid="${entityName}">
        Content
      </${componentName}>,
    );

    expect(screen.getByTestId("${entityName}")).toBeInTheDocument();
  });
});
`;
}

function createStoryTemplate(params: {
  componentName: string;
  entityName: string;
  domain: string;
}): string {
  const { componentName, entityName, domain } = params;

  const domainName = toPascalCase(domain);

  return `import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import ${componentName} from "./${entityName}";

const meta: Meta<typeof ${componentName}> = {
  title: "Entities/${domainName}/${componentName}",
  component: ${componentName},
  args: {
    children: "${componentName}",
  },
};

export default meta;

type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {};
`;
}

function createLocalIndexTemplate(params: { componentName: string; entityName: string }): string {
  const { componentName, entityName } = params;

  return `export { default as ${componentName} } from "./${entityName}";
`;
}

async function validateApp(params: { workspaceRoot: string; app: string }): Promise<void> {
  const { workspaceRoot, app } = params;

  const appNames = await findWorkspaceAppNames(workspaceRoot);

  if (appNames.includes(app)) {
    return;
  }

  throw new Error(
    [`[entity] unknown app: ${app}`, `Available apps: ${appNames.join(", ") || "(none)"}`].join(
      "\n",
    ),
  );
}

export async function generateEntity(params: GenerateEntityParams): Promise<void> {
  const options = parseOptions(params);

  const workspaceRoot = await findWorkspaceRoot(params.cwd ?? process.cwd());

  await validateApp({
    workspaceRoot,
    app: options.app,
  });

  const componentName = toPascalCase(options.name);

  const domainDirectory = path.join(
    workspaceRoot,
    "apps",
    options.app,
    "src",
    "entities",
    options.domain,
  );

  const uiDirectory = path.join(domainDirectory, "ui");

  const componentDirectory = path.join(uiDirectory, options.name);

  logger.info("entity.generator", {
    app: options.app,
    domain: options.domain,
    name: options.name,
    componentName,
  });

  await writeFileSafe({
    path: path.join(componentDirectory, `${options.name}.tsx`),
    content: createComponentTemplate({
      componentName,
    }),
  });

  await writeFileSafe({
    path: path.join(componentDirectory, `${options.name}.test.tsx`),
    content: createTestTemplate({
      componentName,
      entityName: options.name,
    }),
  });

  await writeFileSafe({
    path: path.join(componentDirectory, `${options.name}.stories.tsx`),
    content: createStoryTemplate({
      componentName,
      entityName: options.name,
      domain: options.domain,
    }),
  });

  await writeFileSafe({
    path: path.join(componentDirectory, "index.ts"),
    content: createLocalIndexTemplate({
      componentName,
      entityName: options.name,
    }),
  });

  await syncEntityUiIndex(uiDirectory);

  await syncEntityDomainIndex({
    domainIndexPath: path.join(domainDirectory, "index.ts"),
    uiIndexPath: path.join(uiDirectory, "index.ts"),
  });

  logger.info("entity.created", {
    app: options.app,
    domain: options.domain,
    name: options.name,
  });
}
