import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";

const DEFAULT_FROM_SCOPE_NAME = "repo";
const DEFAULT_FROM_PROJECT_NAME = "boilerplate-turborepo";

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

const cleanupDirectoryNames = ["node_modules", ".turbo", ".next", "dist", "coverage"];

interface InitProjectOptions {
  projectName: string;
  fromProjectName: string;
  fromScopeName: string;
  toScopeName: string;
  rootPath: string;
  dryRun: boolean;
  removeGit: boolean;
  keepGit: boolean;
}

interface ParsedArgs {
  projectName: string;
  fromProjectName: string;
  fromScopeName: string;
  toScopeName: string;
  dryRun: boolean;
  removeGit: boolean;
  keepGit: boolean;
}

interface InitProjectResult {
  checkedFileCount: number;
  changedFileCount: number;
  changedFiles: string[];
  createdFiles: string[];
  removedPaths: string[];
  gitRemoved: boolean;
}

function printHelp() {
  console.info(`
Usage:
  pnpm init-project <project-name> [options]

Examples:
  pnpm init-project mars
  pnpm init-project mars --dry-run
  pnpm init-project mars --scope eten
  pnpm init-project mars --from-scope repo --scope eten
  pnpm init-project mars --remove-git
  pnpm init-project mars --keep-git

Options:
  --scope <scope-name>             Target package scope. Default: project name.
  --from-scope <scope-name>        Existing package scope. Default: repo.
  --from-name <project-name>       Existing project name. Default: boilerplate-turborepo.
  --dry-run                       Print changes without writing files.
  --remove-git                    Remove .git without asking.
  --keep-git                      Keep .git without asking.
`);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function normalizeScopeName(value: string): string {
  return value.trim().replace(/^@/, "");
}

function normalizeProjectName(value: string): string {
  return value.trim().toLowerCase();
}

function toScope(scopeName: string): string {
  return `@${scopeName}`;
}

function validateProjectName(projectName: string): void {
  if (!projectName) {
    throw new Error("[init-project] project name is required.");
  }

  if (!/^[a-z0-9][a-z0-9-]*$/.test(projectName)) {
    throw new Error(
      [
        `[init-project] invalid project name: ${projectName}`,
        "Use lowercase letters, numbers, and hyphens only.",
        "Example: mars, eten-studio, my-company",
      ].join("\n"),
    );
  }
}

function validateScopeName(scopeName: string): void {
  if (!scopeName) {
    throw new Error("[init-project] scope name is required.");
  }

  if (!/^[a-z0-9][a-z0-9-]*$/.test(scopeName)) {
    throw new Error(
      [
        `[init-project] invalid scope name: ${scopeName}`,
        "Use lowercase letters, numbers, and hyphens only.",
        "Example: mars, eten, my-company",
      ].join("\n"),
    );
  }
}

function readOptionValue(params: { args: string[]; index: number; optionName: string }): string {
  const { args, index, optionName } = params;
  const value = args[index + 1];

  if (!value || value.startsWith("--")) {
    throw new Error(`[init-project] ${optionName} option requires a value.`);
  }

  return value;
}

function parseArgs(argv: string[]): ParsedArgs {
  const [rawProjectName, ...args] = argv;

  if (!rawProjectName) {
    throw new Error("[init-project] project name is required.");
  }

  const projectName = normalizeProjectName(rawProjectName);
  let fromProjectName = DEFAULT_FROM_PROJECT_NAME;
  let fromScopeName = DEFAULT_FROM_SCOPE_NAME;
  let toScopeName = projectName;
  let dryRun = false;
  let removeGit = false;
  let keepGit = false;

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];

    if (!current) {
      continue;
    }

    if (current === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (current === "--remove-git") {
      removeGit = true;
      continue;
    }

    if (current === "--keep-git") {
      keepGit = true;
      continue;
    }

    if (current === "--scope") {
      toScopeName = normalizeScopeName(
        readOptionValue({
          args,
          index,
          optionName: "--scope",
        }),
      );

      index += 1;
      continue;
    }

    if (current.startsWith("--scope=")) {
      const [, value] = current.split("=");

      if (!value) {
        throw new Error("[init-project] --scope option requires a value.");
      }

      toScopeName = normalizeScopeName(value);
      continue;
    }

    if (current === "--from-scope") {
      fromScopeName = normalizeScopeName(
        readOptionValue({
          args,
          index,
          optionName: "--from-scope",
        }),
      );

      index += 1;
      continue;
    }

    if (current.startsWith("--from-scope=")) {
      const [, value] = current.split("=");

      if (!value) {
        throw new Error("[init-project] --from-scope option requires a value.");
      }

      fromScopeName = normalizeScopeName(value);
      continue;
    }

    if (current === "--from-name") {
      fromProjectName = normalizeProjectName(
        readOptionValue({
          args,
          index,
          optionName: "--from-name",
        }),
      );

      index += 1;
      continue;
    }

    if (current.startsWith("--from-name=")) {
      const [, value] = current.split("=");

      if (!value) {
        throw new Error("[init-project] --from-name option requires a value.");
      }

      fromProjectName = normalizeProjectName(value);
      continue;
    }

    throw new Error(`[init-project] unknown option: ${current}`);
  }

  validateProjectName(projectName);
  validateProjectName(fromProjectName);
  validateScopeName(fromScopeName);
  validateScopeName(toScopeName);

  if (removeGit && keepGit) {
    throw new Error("[init-project] --remove-git and --keep-git cannot be used together.");
  }

  return {
    projectName,
    fromProjectName,
    fromScopeName,
    toScopeName,
    dryRun,
    removeGit,
    keepGit,
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

function replaceProjectValues(params: {
  content: string;
  fromProjectName: string;
  projectName: string;
  fromScopeName: string;
  toScopeName: string;
}): string {
  const { content, fromProjectName, projectName, fromScopeName, toScopeName } = params;

  return content
    .replaceAll(toScope(fromScopeName), toScope(toScopeName))
    .replaceAll(fromProjectName, projectName);
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return false;
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

async function replaceProjectValuesInFile(params: {
  filePath: string;
  fromProjectName: string;
  projectName: string;
  fromScopeName: string;
  toScopeName: string;
  dryRun: boolean;
}): Promise<boolean> {
  const { filePath, fromProjectName, projectName, fromScopeName, toScopeName, dryRun } = params;

  const content = await readFile(filePath, "utf8");
  const nextContent = replaceProjectValues({
    content,
    fromProjectName,
    projectName,
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
      throw new Error("[init-project] failed to find repository root.");
    }

    currentPath = parentPath;
  }
}

async function ensureEnvExample(params: { rootPath: string; dryRun: boolean }): Promise<string[]> {
  const { rootPath, dryRun } = params;
  const envExamplePath = path.join(rootPath, ".env.example");

  if (await exists(envExamplePath)) {
    return [];
  }

  const content = [
    "NODE_ENV=development",
    "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app",
    "NEXT_PUBLIC_WEB_APP_URL=http://localhost:3000",
    "NEXT_PUBLIC_ADMIN_APP_URL=http://localhost:3001",
    "",
  ].join("\n");

  if (!dryRun) {
    await writeFile(envExamplePath, content);
  }

  return [".env.example"];
}

async function cleanupGeneratedDirectories(params: {
  rootPath: string;
  dryRun: boolean;
}): Promise<string[]> {
  const { rootPath, dryRun } = params;
  const removedPaths: string[] = [];

  async function cleanup(directoryPath: string): Promise<void> {
    const entries = await readdir(directoryPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const entryPath = path.join(directoryPath, entry.name);

      if (!entry.isDirectory()) {
        continue;
      }

      if (cleanupDirectoryNames.includes(entry.name)) {
        removedPaths.push(path.relative(rootPath, entryPath));

        if (!dryRun) {
          await rm(entryPath, {
            recursive: true,
            force: true,
          });
        }

        continue;
      }

      if (entry.name === ".git") {
        continue;
      }

      await cleanup(entryPath);
    }
  }

  await cleanup(rootPath);

  removedPaths.sort((a, b) => a.localeCompare(b));

  return removedPaths;
}

async function shouldRemoveGit(params: {
  rootPath: string;
  removeGit: boolean;
  keepGit: boolean;
  dryRun: boolean;
}): Promise<boolean> {
  const { rootPath, removeGit, keepGit, dryRun } = params;
  const gitPath = path.join(rootPath, ".git");

  if (!(await exists(gitPath))) {
    return false;
  }

  if (keepGit) {
    return false;
  }

  if (removeGit) {
    return true;
  }

  if (dryRun || !process.stdin.isTTY) {
    return false;
  }

  const readline = createInterface({
    input,
    output,
  });

  const answer = await readline.question("Remove existing .git directory? (y/N) ");
  readline.close();

  return answer.trim().toLowerCase() === "y";
}

async function removeGitDirectory(params: { rootPath: string; dryRun: boolean }): Promise<boolean> {
  const { rootPath, dryRun } = params;
  const gitPath = path.join(rootPath, ".git");

  if (!(await exists(gitPath))) {
    return false;
  }

  if (!dryRun) {
    await rm(gitPath, {
      recursive: true,
      force: true,
    });
  }

  return true;
}

async function initProject(options: InitProjectOptions): Promise<InitProjectResult> {
  const { rootPath, fromProjectName, projectName, fromScopeName, toScopeName, dryRun } = options;
  const rootStat = await stat(rootPath);

  if (!rootStat.isDirectory()) {
    throw new Error(`[init-project] root path is not a directory: ${rootPath}`);
  }

  const files = await collectTargetFiles(rootPath);
  const changedFiles: string[] = [];

  for (const filePath of files) {
    const changed = await replaceProjectValuesInFile({
      filePath,
      fromProjectName,
      projectName,
      fromScopeName,
      toScopeName,
      dryRun,
    });

    if (changed) {
      changedFiles.push(path.relative(rootPath, filePath));
    }
  }

  const createdFiles = await ensureEnvExample({
    rootPath,
    dryRun,
  });

  const removedPaths = await cleanupGeneratedDirectories({
    rootPath,
    dryRun,
  });

  const shouldRemoveExistingGit = await shouldRemoveGit({
    rootPath,
    removeGit: options.removeGit,
    keepGit: options.keepGit,
    dryRun,
  });

  const gitRemoved = shouldRemoveExistingGit
    ? await removeGitDirectory({
        rootPath,
        dryRun,
      })
    : false;

  changedFiles.sort((a, b) => a.localeCompare(b));

  return {
    checkedFileCount: files.length,
    changedFileCount: changedFiles.length,
    changedFiles,
    createdFiles,
    removedPaths,
    gitRemoved,
  };
}

function printResult(params: {
  result: InitProjectResult;
  projectName: string;
  fromProjectName: string;
  fromScopeName: string;
  toScopeName: string;
  dryRun: boolean;
}): void {
  const { result, projectName, fromProjectName, fromScopeName, toScopeName, dryRun } = params;
  const title = dryRun ? "[init-project] dry run completed" : "[init-project] completed";

  console.info(
    [
      title,
      `project: ${fromProjectName} -> ${projectName}`,
      `scope: ${toScope(fromScopeName)} -> ${toScope(toScopeName)}`,
      `checked files: ${result.checkedFileCount}`,
      `changed files: ${result.changedFileCount}`,
      `created files: ${result.createdFiles.length}`,
      `removed paths: ${result.removedPaths.length}`,
      `git removed: ${result.gitRemoved ? "yes" : "no"}`,
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

  if (result.createdFiles.length > 0) {
    console.info(
      [
        "",
        dryRun ? "Files to create:" : "Created files:",
        ...result.createdFiles.map((filePath) => `  ${filePath}`),
      ].join("\n"),
    );
  }

  if (result.removedPaths.length > 0) {
    console.info(
      [
        "",
        dryRun ? "Paths to remove:" : "Removed paths:",
        ...result.removedPaths.map((filePath) => `  ${filePath}`),
      ].join("\n"),
    );
  }

  if (dryRun) {
    console.info(
      ["", "No files were written.", "Run without --dry-run to apply these changes."].join("\n"),
    );
    return;
  }

  console.info(
    [
      "",
      "Next steps:",
      "  pnpm install",
      "  pnpm format",
      "  pnpm check",
      "",
      "Optional:",
      "  git init",
      "  git add .",
      '  git commit -m "chore: initialize project"',
    ].join("\n"),
  );
}

async function main() {
  try {
    const parsedArgs = parseArgs(process.argv.slice(2));
    const rootPath = await findRepositoryRoot(process.cwd());

    const result = await initProject({
      rootPath,
      projectName: parsedArgs.projectName,
      fromProjectName: parsedArgs.fromProjectName,
      fromScopeName: parsedArgs.fromScopeName,
      toScopeName: parsedArgs.toScopeName,
      dryRun: parsedArgs.dryRun,
      removeGit: parsedArgs.removeGit,
      keepGit: parsedArgs.keepGit,
    });

    printResult({
      result,
      projectName: parsedArgs.projectName,
      fromProjectName: parsedArgs.fromProjectName,
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
