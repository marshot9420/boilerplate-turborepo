import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { logger } from "../utils/logger";
import { toKebabCase, toPascalCase } from "../utils/string";
import { findWorkspaceAppNames, findWorkspaceRoot } from "../utils/workspace";

interface GenerateFeatureParams {
  name: string;
  args: string[];
}

interface FeatureGeneratorOptions {
  app: string;
  domain: string;
  name: string;
  uiName: string;
  force: boolean;
}

interface ParsedFlag {
  key: string;
  value: string | true;
}

interface GeneratedFile {
  filePath: string;
  content: string;
}

const supportedFlags = new Set(["app", "domain", "ui", "force"]);

function parseFlag(value: string, nextValue: string | undefined): ParsedFlag {
  if (!value.startsWith("--")) {
    throw new Error(`[feature] invalid option format: ${value}`);
  }

  const normalized = value.slice(2);
  const [key, inlineValue] = normalized.split("=");

  if (!key) {
    throw new Error(`[feature] invalid option name: ${value}`);
  }

  if (!supportedFlags.has(key)) {
    throw new Error(`[feature] unsupported option: --${key}`);
  }

  if (inlineValue !== undefined) {
    return {
      key,
      value: inlineValue,
    };
  }

  if (key === "force") {
    return {
      key,
      value: true,
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

function parseOptions(params: GenerateFeatureParams): FeatureGeneratorOptions {
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
  const rawUiName = flags.get("ui");

  if (typeof rawApp !== "string") {
    throw new Error("[feature] --app is required. Example: --app web");
  }

  if (typeof rawDomain !== "string") {
    throw new Error("[feature] --domain is required. Example: --domain order");
  }

  if (typeof rawUiName !== "string") {
    throw new Error("[feature] --ui is required. Example: --ui register-order-dialog");
  }

  const app = toKebabCase(rawApp);
  const domain = toKebabCase(rawDomain);
  const featureName = toKebabCase(name);
  const uiName = toKebabCase(rawUiName);

  if (!app) {
    throw new Error("[feature] app name is invalid.");
  }

  if (!domain) {
    throw new Error("[feature] domain name is invalid.");
  }

  if (!featureName) {
    throw new Error("[feature] feature name is invalid.");
  }

  if (!uiName) {
    throw new Error("[feature] UI component name is invalid.");
  }

  return {
    app,
    domain,
    name: featureName,
    uiName,
    force: flags.has("force"),
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

async function validateApp(params: { workspaceRoot: string; app: string }): Promise<void> {
  const { workspaceRoot, app } = params;

  const appNames = await findWorkspaceAppNames(workspaceRoot);

  if (appNames.includes(app)) {
    return;
  }

  throw new Error(
    [`[feature] unknown app: ${app}`, `Available apps: ${appNames.join(", ") || "(none)"}`].join(
      "\n",
    ),
  );
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

function createTestTemplate(params: { componentName: string; uiName: string }): string {
  const { componentName, uiName } = params;

  return `import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ${componentName} from "./${uiName}";

describe("${componentName}", () => {
  it("children을 렌더링한다", () => {
    render(<${componentName}>Content</${componentName}>);

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("HTML 속성을 전달한다", () => {
    render(
      <${componentName} data-testid="${uiName}">
        Content
      </${componentName}>,
    );

    expect(screen.getByTestId("${uiName}")).toBeInTheDocument();
  });
});
`;
}

function createStoryTemplate(params: {
  componentName: string;
  domain: string;
  featureName: string;
  uiName: string;
}): string {
  const { componentName, domain, featureName, uiName } = params;

  const domainName = toPascalCase(domain);
  const featureTitle = toPascalCase(featureName);

  return `import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import ${componentName} from "./${uiName}";

const meta: Meta<typeof ${componentName}> = {
  title: "Features/${domainName}/${featureTitle}/${componentName}",
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

function createComponentIndexTemplate(params: { componentName: string; uiName: string }): string {
  const { componentName, uiName } = params;

  return `export { default as ${componentName} } from "./${uiName}";
`;
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

async function syncFeatureUiIndex(uiDirectory: string): Promise<void> {
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

    const content = await readFile(componentIndexPath, "utf8");

    const exportNames = extractRuntimeExportNames(content);

    if (exportNames.length === 0) {
      continue;
    }

    lines.push(createNamedExportStatement(exportNames, `./${componentDirectory.name}`));
  }

  const uiIndexPath = path.join(uiDirectory, "index.ts");

  await writeFile(uiIndexPath, `${lines.join("\n")}\n`);

  logger.info("feature.ui_export.updated", {
    path: uiIndexPath,
  });
}

async function syncFeatureIndex(params: { featureDirectory: string }): Promise<void> {
  const { featureDirectory } = params;

  const uiIndexPath = path.join(featureDirectory, "ui", "index.ts");

  const featureIndexPath = path.join(featureDirectory, "index.ts");

  const uiIndexContent = await readFile(uiIndexPath, "utf8");

  const exportNames = extractRuntimeExportNames(uiIndexContent);

  if (exportNames.length === 0) {
    return;
  }

  const uiExportStatement = createNamedExportStatement(exportNames, "./ui");

  const currentContent = await readTextFileOrEmpty(featureIndexPath);

  const uiExportPattern = /export\s+(?:\*\s+|\{[\s\S]*?\}\s+)from\s*["']\.\/ui["'];?/g;

  let replaced = false;

  const nextContent = currentContent.replace(uiExportPattern, () => {
    if (replaced) {
      return "";
    }

    replaced = true;

    return uiExportStatement;
  });

  const normalizedContent = replaced
    ? nextContent
    : [currentContent.trimEnd(), uiExportStatement].filter(Boolean).join("\n\n");

  const finalContent = normalizedContent.replace(/\n{3,}/g, "\n\n").trim();

  await writeFile(featureIndexPath, `${finalContent}\n`);

  logger.info("feature.export.updated", {
    path: featureIndexPath,
  });
}

async function syncFeatureDomainIndex(params: { domainDirectory: string }): Promise<void> {
  const { domainDirectory } = params;

  const entries = await readdir(domainDirectory, {
    withFileTypes: true,
  });

  const featureDirectories = entries
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  const lines: string[] = [];

  for (const featureDirectory of featureDirectories) {
    const featureIndexPath = path.join(domainDirectory, featureDirectory.name, "index.ts");

    if (!(await exists(featureIndexPath))) {
      continue;
    }

    const content = await readFile(featureIndexPath, "utf8");

    const exportNames = extractRuntimeExportNames(content);

    if (exportNames.length === 0) {
      continue;
    }

    lines.push(createNamedExportStatement(exportNames, `./${featureDirectory.name}`));
  }

  const domainIndexPath = path.join(domainDirectory, "index.ts");

  await writeFile(domainIndexPath, `${lines.join("\n")}\n`);

  logger.info("feature.domain_export.updated", {
    path: domainIndexPath,
  });
}

function createGeneratedFiles(params: {
  componentDirectory: string;
  componentName: string;
  domain: string;
  featureName: string;
  uiName: string;
}): GeneratedFile[] {
  const { componentDirectory, componentName, domain, featureName, uiName } = params;

  return [
    {
      filePath: path.join(componentDirectory, `${uiName}.tsx`),
      content: createComponentTemplate({
        componentName,
      }),
    },
    {
      filePath: path.join(componentDirectory, `${uiName}.test.tsx`),
      content: createTestTemplate({
        componentName,
        uiName,
      }),
    },
    {
      filePath: path.join(componentDirectory, `${uiName}.stories.tsx`),
      content: createStoryTemplate({
        componentName,
        domain,
        featureName,
        uiName,
      }),
    },
    {
      filePath: path.join(componentDirectory, "index.ts"),
      content: createComponentIndexTemplate({
        componentName,
        uiName,
      }),
    },
  ];
}

async function assertGeneratedFilesCanBeWritten(
  files: GeneratedFile[],
  force: boolean,
): Promise<void> {
  if (force) {
    return;
  }

  const existingFiles: string[] = [];

  for (const file of files) {
    if (await exists(file.filePath)) {
      existingFiles.push(file.filePath);
    }
  }

  if (existingFiles.length === 0) {
    return;
  }

  throw new Error(
    [
      "[feature] generated files already exist:",
      ...existingFiles.map((filePath) => `- ${filePath}`),
      "Use --force to overwrite them.",
    ].join("\n"),
  );
}

async function writeGeneratedFiles(files: GeneratedFile[]): Promise<void> {
  for (const file of files) {
    await mkdir(path.dirname(file.filePath), {
      recursive: true,
    });

    await writeFile(file.filePath, file.content);

    logger.info("file.created", {
      path: file.filePath,
    });
  }
}

export async function generateFeature(params: GenerateFeatureParams): Promise<void> {
  const options = parseOptions(params);

  const workspaceRoot = await findWorkspaceRoot();

  await validateApp({
    workspaceRoot,
    app: options.app,
  });

  const componentName = toPascalCase(options.uiName);

  const domainDirectory = path.join(
    workspaceRoot,
    "apps",
    options.app,
    "src",
    "features",
    options.domain,
  );

  const featureDirectory = path.join(domainDirectory, options.name);

  const uiDirectory = path.join(featureDirectory, "ui");

  const componentDirectory = path.join(uiDirectory, options.uiName);

  const generatedFiles = createGeneratedFiles({
    componentDirectory,
    componentName,
    domain: options.domain,
    featureName: options.name,
    uiName: options.uiName,
  });

  await assertGeneratedFilesCanBeWritten(generatedFiles, options.force);

  logger.info("feature.generator", {
    app: options.app,
    domain: options.domain,
    name: options.name,
    ui: options.uiName,
    componentName,
  });

  await writeGeneratedFiles(generatedFiles);

  await syncFeatureUiIndex(uiDirectory);

  await syncFeatureIndex({
    featureDirectory,
  });

  await syncFeatureDomainIndex({
    domainDirectory,
  });

  logger.info("feature.created", {
    app: options.app,
    domain: options.domain,
    name: options.name,
    ui: options.uiName,
  });
}
