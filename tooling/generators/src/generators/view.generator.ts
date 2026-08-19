import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { logger } from "../utils/logger";
import { toKebabCase, toPascalCase } from "../utils/string";
import { findWorkspaceAppNames, findWorkspaceRoot } from "../utils/workspace";

interface GenerateViewParams {
  name: string;
  args: string[];
}

interface ViewGeneratorOptions {
  app: string;
  domain: string;
  name: string;
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

const supportedFlags = new Set(["app", "domain", "force"]);

function parseFlag(value: string, nextValue: string | undefined): ParsedFlag {
  if (!value.startsWith("--")) {
    throw new Error(`[view] invalid option format: ${value}`);
  }

  const normalized = value.slice(2);
  const [key, inlineValue] = normalized.split("=");

  if (!key) {
    throw new Error(`[view] invalid option name: ${value}`);
  }

  if (!supportedFlags.has(key)) {
    throw new Error(`[view] unsupported option: --${key}`);
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

function parseOptions(params: GenerateViewParams): ViewGeneratorOptions {
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
    throw new Error("[view] --app is required. Example: --app admin");
  }

  if (typeof rawDomain !== "string") {
    throw new Error("[view] --domain is required. Example: --domain order");
  }

  const app = toKebabCase(rawApp);
  const domain = toKebabCase(rawDomain);
  const viewName = toKebabCase(name);

  if (!app) {
    throw new Error("[view] app name is invalid.");
  }

  if (!domain) {
    throw new Error("[view] domain name is invalid.");
  }

  if (!viewName) {
    throw new Error("[view] view name is invalid.");
  }

  return {
    app,
    domain,
    name: viewName,
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

async function validateApp(params: { workspaceRoot: string; app: string }): Promise<void> {
  const { workspaceRoot, app } = params;

  const appNames = await findWorkspaceAppNames(workspaceRoot);

  if (appNames.includes(app)) {
    return;
  }

  throw new Error(
    [`[view] unknown app: ${app}`, `Available apps: ${appNames.join(", ") || "(none)"}`].join("\n"),
  );
}

function createViewTemplate(params: { componentName: string }): string {
  const { componentName } = params;

  return `export default function ${componentName}() {
  return <div>${componentName}</div>;
}
`;
}

function createUiIndexTemplate(params: { componentName: string; viewName: string }): string {
  const { componentName, viewName } = params;

  return `export { default as ${componentName} } from "./${viewName}";
`;
}

function createViewIndexTemplate(params: { componentName: string }): string {
  const { componentName } = params;

  return `export { ${componentName} } from "./ui";
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

async function syncViewDomainIndex(params: { domainDirectory: string }): Promise<void> {
  const { domainDirectory } = params;

  const entries = await readdir(domainDirectory, {
    withFileTypes: true,
  });

  const viewDirectories = entries
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  const lines: string[] = [];

  for (const viewDirectory of viewDirectories) {
    const viewIndexPath = path.join(domainDirectory, viewDirectory.name, "index.ts");

    if (!(await exists(viewIndexPath))) {
      continue;
    }

    const content = await readFile(viewIndexPath, "utf8");
    const exportNames = extractRuntimeExportNames(content);

    if (exportNames.length === 0) {
      continue;
    }

    lines.push(createNamedExportStatement(exportNames, `./${viewDirectory.name}`));
  }

  const domainIndexPath = path.join(domainDirectory, "index.ts");

  await writeFile(domainIndexPath, `${lines.join("\n")}\n`);

  logger.info("view.domain_export.updated", {
    path: domainIndexPath,
  });
}

function createGeneratedFiles(params: {
  viewDirectory: string;
  componentName: string;
  viewName: string;
}): GeneratedFile[] {
  const { viewDirectory, componentName, viewName } = params;

  const uiDirectory = path.join(viewDirectory, "ui");

  return [
    {
      filePath: path.join(uiDirectory, `${viewName}.tsx`),
      content: createViewTemplate({
        componentName,
      }),
    },
    {
      filePath: path.join(uiDirectory, "index.ts"),
      content: createUiIndexTemplate({
        componentName,
        viewName,
      }),
    },
    {
      filePath: path.join(viewDirectory, "index.ts"),
      content: createViewIndexTemplate({
        componentName,
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
      "[view] generated files already exist:",
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

export async function generateView(params: GenerateViewParams): Promise<void> {
  const options = parseOptions(params);

  const workspaceRoot = await findWorkspaceRoot();

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
    "views",
    options.domain,
  );

  const viewDirectory = path.join(domainDirectory, options.name);

  const generatedFiles = createGeneratedFiles({
    viewDirectory,
    componentName,
    viewName: options.name,
  });

  await assertGeneratedFilesCanBeWritten(generatedFiles, options.force);

  logger.info("view.generator", {
    app: options.app,
    domain: options.domain,
    name: options.name,
    componentName,
  });

  await writeGeneratedFiles(generatedFiles);

  await syncViewDomainIndex({
    domainDirectory,
  });

  logger.info("view.created", {
    app: options.app,
    domain: options.domain,
    name: options.name,
  });
}
