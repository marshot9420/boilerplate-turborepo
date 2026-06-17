import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const CURRENT_SCOPE = "@repo";

const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "out",
]);

const targetExtensions = new Set([
  ".cjs",
  ".css",
  ".cts",
  ".js",
  ".json",
  ".jsx",
  ".mjs",
  ".md",
  ".mdx",
  ".mts",
  ".prisma",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const targetFilenames = new Set([
  ".env",
  ".env.example",
  ".env.local",
  ".env.production",
  ".env.development",
  ".npmrc",
  ".nvmrc",
  "Dockerfile",
]);

interface SetupScopeOptions {
  nextScopeName: string;
  rootPath: string;
}

interface ReplaceResult {
  checkedFileCount: number;
  changedFileCount: number;
}

function printHelp() {
  console.info(`
Usage:
  pnpm setup:scope <scope-name>

Examples:
  pnpm setup:scope mars
  pnpm setup:scope acme

Result:
  @repo/core -> @repo/core
`);
}

function normalizeScopeName(value: string): string {
  return value.trim().replace(/^@/, "");
}

function validateScopeName(scopeName: string): void {
  if (!scopeName) {
    throw new Error("[setup:scope] scope name is required.");
  }

  if (!/^[a-z0-9][a-z0-9-]*$/.test(scopeName)) {
    throw new Error(
      [
        `[setup:scope] invalid scope name: ${scopeName}`,
        "Use lowercase letters, numbers, and hyphens only.",
        "Example: mars, acme, my-company",
      ].join("\n"),
    );
  }
}

function shouldIgnoreDirectory(directoryName: string): boolean {
  return ignoredDirectories.has(directoryName);
}

function shouldProcessFile(filePath: string): boolean {
  const fileName = path.basename(filePath);

  if (targetFilenames.has(fileName)) {
    return true;
  }

  const extension = path.extname(filePath);

  return targetExtensions.has(extension);
}

function replaceScope(content: string, nextScopeName: string): string {
  const nextScope = `@${nextScopeName}`;

  return content.replaceAll(CURRENT_SCOPE, nextScope);
}

async function collectTargetFiles(directoryPath: string): Promise<string[]> {
  const entries = await readdir(directoryPath, {
    withFileTypes: true,
  });

  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      if (shouldIgnoreDirectory(entry.name)) {
        continue;
      }

      files.push(...(await collectTargetFiles(entryPath)));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!shouldProcessFile(entryPath)) {
      continue;
    }

    files.push(entryPath);
  }

  return files;
}

async function replaceScopeInFile(filePath: string, nextScopeName: string): Promise<boolean> {
  const content = await readFile(filePath, "utf8");
  const nextContent = replaceScope(content, nextScopeName);

  if (content === nextContent) {
    return false;
  }

  await writeFile(filePath, nextContent);

  return true;
}

async function replaceScopeInRepository(options: SetupScopeOptions): Promise<ReplaceResult> {
  const { rootPath, nextScopeName } = options;
  const rootStat = await stat(rootPath);

  if (!rootStat.isDirectory()) {
    throw new Error(`[setup:scope] root path is not a directory: ${rootPath}`);
  }

  const files = await collectTargetFiles(rootPath);
  let changedFileCount = 0;

  for (const filePath of files) {
    const changed = await replaceScopeInFile(filePath, nextScopeName);

    if (changed) {
      changedFileCount += 1;
    }
  }

  return {
    checkedFileCount: files.length,
    changedFileCount,
  };
}

async function main() {
  const [, , rawScopeName] = process.argv;

  if (!rawScopeName) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  const nextScopeName = normalizeScopeName(rawScopeName);

  validateScopeName(nextScopeName);

  const rootPath = path.resolve(process.cwd(), "..", "..");

  const result = await replaceScopeInRepository({
    rootPath,
    nextScopeName,
  });

  console.info(
    [
      "[setup:scope] completed",
      `scope: ${CURRENT_SCOPE} -> @${nextScopeName}`,
      `checked files: ${result.checkedFileCount}`,
      `changed files: ${result.changedFileCount}`,
      "",
      "Next steps:",
      "  pnpm install",
      "  pnpm format",
      "  pnpm check",
    ].join("\n"),
  );
}

await main();
