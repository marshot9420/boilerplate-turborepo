import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_FROM_SCOPE_NAME = "repo";

const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "out",
]);

const ignoredFilenames = new Set(["pnpm-lock.yaml"]);

const targetExtensions = new Set([
  ".cjs",
  ".css",
  ".cts",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mdx",
  ".mjs",
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
  fromScopeName: string;
  toScopeName: string;
  dryRun: boolean;
  rootPath: string;
}

interface ReplaceResult {
  checkedFileCount: number;
  changedFileCount: number;
  changedFiles: string[];
}

interface ParsedArgs {
  toScopeName: string;
  fromScopeName: string;
  dryRun: boolean;
}

function printHelp() {
  console.info(`
Usage:
  pnpm setup:scope <scope-name> [options]

Examples:
  pnpm setup:scope mars
  pnpm setup:scope mars --dry-run
  pnpm setup:scope eten --from mars
  pnpm setup:scope eten --from mars --dry-run

Options:
  --from <scope-name>  Existing scope name. Default: repo
  --dry-run            Print files that would change without writing files.
`);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function normalizeScopeName(value: string): string {
  return value.trim().replace(/^@/, "");
}

function toScope(scopeName: string): string {
  return `@${scopeName}`;
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

function parseArgs(argv: string[]): ParsedArgs {
  const [rawToScopeName, ...args] = argv;

  if (!rawToScopeName) {
    throw new Error("[setup:scope] target scope name is required.");
  }

  const toScopeName = normalizeScopeName(rawToScopeName);

  let fromScopeName = DEFAULT_FROM_SCOPE_NAME;
  let dryRun = false;

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];

    if (!current) {
      continue;
    }

    if (current === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (current === "--from") {
      const next = args[index + 1];

      if (!next || next.startsWith("--")) {
        throw new Error("[setup:scope] --from option requires a value.");
      }

      fromScopeName = normalizeScopeName(next);
      index += 1;
      continue;
    }

    if (current.startsWith("--from=")) {
      const [, value] = current.split("=");

      if (!value) {
        throw new Error("[setup:scope] --from option requires a value.");
      }

      fromScopeName = normalizeScopeName(value);
      continue;
    }

    throw new Error(`[setup:scope] unknown option: ${current}`);
  }

  validateScopeName(fromScopeName);
  validateScopeName(toScopeName);

  if (fromScopeName === toScopeName) {
    throw new Error(`[setup:scope] from scope and target scope are the same: @${toScopeName}`);
  }

  return {
    fromScopeName,
    toScopeName,
    dryRun,
  };
}

function shouldIgnoreDirectory(directoryName: string): boolean {
  return ignoredDirectories.has(directoryName);
}

function shouldProcessFile(filePath: string): boolean {
  const fileName = path.basename(filePath);

  if (ignoredFilenames.has(fileName)) {
    return false;
  }

  if (targetFilenames.has(fileName)) {
    return true;
  }

  const extension = path.extname(filePath);

  return targetExtensions.has(extension);
}

function replaceScope(params: {
  content: string;
  fromScopeName: string;
  toScopeName: string;
}): string {
  const { content, fromScopeName, toScopeName } = params;

  return content.replaceAll(toScope(fromScopeName), toScope(toScopeName));
}

async function readTextFile(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return "";
    }

    throw error;
  }
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

async function replaceScopeInFile(params: {
  filePath: string;
  fromScopeName: string;
  toScopeName: string;
  dryRun: boolean;
}): Promise<boolean> {
  const { filePath, fromScopeName, toScopeName, dryRun } = params;
  const content = await readTextFile(filePath);

  const nextContent = replaceScope({
    content,
    fromScopeName,
    toScopeName,
  });

  if (content === nextContent) {
    return false;
  }

  if (!dryRun) {
    await writeFile(filePath, nextContent);
  }

  return true;
}

async function replaceScopeInRepository(options: SetupScopeOptions): Promise<ReplaceResult> {
  const { rootPath, fromScopeName, toScopeName, dryRun } = options;
  const rootStat = await stat(rootPath);

  if (!rootStat.isDirectory()) {
    throw new Error(`[setup:scope] root path is not a directory: ${rootPath}`);
  }

  const files = await collectTargetFiles(rootPath);
  const changedFiles: string[] = [];

  for (const filePath of files) {
    const changed = await replaceScopeInFile({
      filePath,
      fromScopeName,
      toScopeName,
      dryRun,
    });

    if (changed) {
      changedFiles.push(path.relative(rootPath, filePath));
    }
  }

  changedFiles.sort((a, b) => a.localeCompare(b));

  return {
    checkedFileCount: files.length,
    changedFileCount: changedFiles.length,
    changedFiles,
  };
}

async function findRepositoryRoot(startPath: string): Promise<string> {
  let currentPath = startPath;

  while (true) {
    const workspaceFilePath = path.join(currentPath, "pnpm-workspace.yaml");

    try {
      await stat(workspaceFilePath);
      return currentPath;
    } catch (error) {
      if (!isNodeError(error) || error.code !== "ENOENT") {
        throw error;
      }
    }

    const parentPath = path.dirname(currentPath);

    if (parentPath === currentPath) {
      throw new Error("[setup:scope] failed to find repository root.");
    }

    currentPath = parentPath;
  }
}

function printResult(params: {
  result: ReplaceResult;
  fromScopeName: string;
  toScopeName: string;
  dryRun: boolean;
}): void {
  const { result, fromScopeName, toScopeName, dryRun } = params;

  const title = dryRun ? "[setup:scope] dry run completed" : "[setup:scope] completed";

  console.info(
    [
      title,
      `scope: ${toScope(fromScopeName)} -> ${toScope(toScopeName)}`,
      `checked files: ${result.checkedFileCount}`,
      `changed files: ${result.changedFileCount}`,
    ].join("\n"),
  );

  if (result.changedFiles.length > 0) {
    console.info(
      [
        "",
        dryRun ? "Files to change:" : "Changed files:",
        ...result.changedFiles.map((filePath) => `  ${filePath}`),
      ].join("\n"),
    );
  }

  if (dryRun) {
    console.info(
      ["", "No files were written.", "Run without --dry-run to apply these changes."].join("\n"),
    );
    return;
  }

  console.info(["", "Next steps:", "  pnpm install", "  pnpm format", "  pnpm check"].join("\n"));
}

async function main() {
  try {
    const parsedArgs = parseArgs(process.argv.slice(2));
    const rootPath = await findRepositoryRoot(process.cwd());

    const result = await replaceScopeInRepository({
      rootPath,
      fromScopeName: parsedArgs.fromScopeName,
      toScopeName: parsedArgs.toScopeName,
      dryRun: parsedArgs.dryRun,
    });

    printResult({
      result,
      fromScopeName: parsedArgs.fromScopeName,
      toScopeName: parsedArgs.toScopeName,
      dryRun: parsedArgs.dryRun,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      printHelp();
      process.exitCode = 1;
      return;
    }

    console.error(error);
    process.exitCode = 1;
  }
}

await main();
