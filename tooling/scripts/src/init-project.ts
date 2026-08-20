import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";

import {
  exists,
  findRepositoryRoot,
  normalizeProjectName,
  normalizeScopeName,
  readCurrentProjectName,
  readCurrentScopeName,
  replaceProjectText,
  toScope,
  toSnakeProjectName,
  validateProjectName,
  validateScopeName,
} from "./project-setup.ts";

const LEGACY_SESSION_COOKIE_NAME = "boilerplate_session";

const cleanupDirectoryNames = new Set([
  "node_modules",
  ".turbo",
  ".next",
  "dist",
  "coverage",
  "out",
]);

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
  fromProjectName?: string;
  fromScopeName?: string;
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
  gitRemoval: boolean;
}

function printHelp() {
  console.info(`
Usage:
  pnpm init-project <project-name> [options]

Examples:
  pnpm init-project mars
  pnpm init-project athena-doctrine --scope athena
  pnpm init-project athena-doctrine --scope athena --dry-run
  pnpm init-project athena-doctrine --scope athena --remove-git

Options:
  --scope <scope-name>
    Target workspace package scope.
    Default: project name.

  --from-scope <scope-name>
    Existing workspace package scope.
    Default: automatically detected from tooling/scripts/package.json.

  --from-name <project-name>
    Existing project name.
    Default: automatically detected from the root package.json.

  --dry-run
    Print changes without writing files.

  --remove-git
    Remove the existing .git directory without asking.

  --keep-git
    Keep the existing .git directory without asking.

Generated env files:
  .env.local
    Created from .env.example if missing.

  .env.test.local
    Created from .env.test.example if missing.

  .env.e2e.local
    Created from .env.e2e.example if missing.
`);
}

function toSessionCookieName(projectName: string): string {
  return `${toSnakeProjectName(projectName)}_session`;
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

  let fromProjectName: string | undefined;
  let fromScopeName: string | undefined;
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
  validateScopeName(toScopeName);

  if (fromProjectName) {
    validateProjectName(fromProjectName);
  }

  if (fromScopeName) {
    validateScopeName(fromScopeName);
  }

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

function replaceProjectValues(params: {
  content: string;
  fromProjectName: string;
  projectName: string;
  fromScopeName: string;
  toScopeName: string;
}): string {
  const { content, fromProjectName, projectName, fromScopeName, toScopeName } = params;

  const fromSnakeProjectName = toSnakeProjectName(fromProjectName);

  const snakeProjectName = toSnakeProjectName(projectName);

  const sessionCookieName = toSessionCookieName(projectName);

  return content
    .replaceAll(toScope(fromScopeName), toScope(toScopeName))
    .replaceAll(fromProjectName, projectName)
    .replaceAll(fromSnakeProjectName, snakeProjectName)
    .replaceAll(LEGACY_SESSION_COOKIE_NAME, sessionCookieName);
}

async function ensureLocalEnvFiles(params: {
  rootPath: string;
  fromProjectName: string;
  projectName: string;
  fromScopeName: string;
  toScopeName: string;
  dryRun: boolean;
}): Promise<string[]> {
  const { rootPath, fromProjectName, projectName, fromScopeName, toScopeName, dryRun } = params;

  const envFilePairs = [
    {
      source: ".env.example",
      target: ".env.local",
    },
    {
      source: ".env.test.example",
      target: ".env.test.local",
    },
    {
      source: ".env.e2e.example",
      target: ".env.e2e.local",
    },
  ];

  const createdFiles: string[] = [];

  for (const pair of envFilePairs) {
    const sourcePath = path.join(rootPath, pair.source);

    const targetPath = path.join(rootPath, pair.target);

    if (!(await exists(sourcePath))) {
      continue;
    }

    if (await exists(targetPath)) {
      continue;
    }

    const sourceContent = await readFile(sourcePath, "utf8");

    const nextContent = replaceProjectValues({
      content: sourceContent,
      fromProjectName,
      projectName,
      fromScopeName,
      toScopeName,
    });

    if (!dryRun) {
      await writeFile(targetPath, nextContent);
    }

    createdFiles.push(pair.target);
  }

  return createdFiles;
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

      if (cleanupDirectoryNames.has(entry.name)) {
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

  try {
    const answer = await readline.question("Remove existing .git directory? (y/N) ");

    return answer.trim().toLowerCase() === "y";
  } finally {
    readline.close();
  }
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

  const replaceResult = await replaceProjectText({
    rootPath,
    dryRun,
    transform: (content) =>
      replaceProjectValues({
        content,
        fromProjectName,
        projectName,
        fromScopeName,
        toScopeName,
      }),
  });

  const createdFiles = await ensureLocalEnvFiles({
    rootPath,
    fromProjectName,
    projectName,
    fromScopeName,
    toScopeName,
    dryRun,
  });

  const removedPaths = await cleanupGeneratedDirectories({
    rootPath,
    dryRun,
  });

  const gitRemovalRequested = await shouldRemoveGit({
    rootPath,
    removeGit: options.removeGit,
    keepGit: options.keepGit,
    dryRun,
  });

  const gitRemoval = gitRemovalRequested
    ? await removeGitDirectory({
        rootPath,
        dryRun,
      })
    : false;

  createdFiles.sort((a, b) => a.localeCompare(b));

  return {
    checkedFileCount: replaceResult.checkedFileCount,
    changedFileCount: replaceResult.changedFileCount,
    changedFiles: replaceResult.changedFiles,
    createdFiles,
    removedPaths,
    gitRemoval,
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

  const gitLabel = dryRun ? "git to remove" : "git removed";

  console.info(
    [
      title,
      `project: ${fromProjectName} -> ${projectName}`,
      `scope: ${toScope(fromScopeName)} -> ${toScope(toScopeName)}`,
      `database prefix: ${toSnakeProjectName(fromProjectName)} -> ${toSnakeProjectName(projectName)}`,
      `session cookie: ${LEGACY_SESSION_COOKIE_NAME} -> ${toSessionCookieName(projectName)}`,
      `checked files: ${result.checkedFileCount}`,
      `changed files: ${result.changedFileCount}`,
      `created files: ${result.createdFiles.length}`,
      `removed paths: ${result.removedPaths.length}`,
      `${gitLabel}: ${result.gitRemoval ? "yes" : "no"}`,
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
      "  configure .env.local",
      "  pnpm db:generate",
      "  pnpm db:push",
      "  pnpm db:seed",
      "  pnpm check",
      "  pnpm dev",
      "",
      "Optional:",
      "  git init",
      "  git add .",
      '  git commit -m "chore: 프로젝트 초기화"',
    ].join("\n"),
  );
}

async function main() {
  try {
    const parsedArgs = parseArgs(process.argv.slice(2));

    const rootPath = await findRepositoryRoot(process.cwd());

    const fromProjectName = parsedArgs.fromProjectName ?? (await readCurrentProjectName(rootPath));

    const fromScopeName = parsedArgs.fromScopeName ?? (await readCurrentScopeName(rootPath));

    validateProjectName(fromProjectName);

    validateScopeName(fromScopeName);

    const result = await initProject({
      rootPath,
      projectName: parsedArgs.projectName,
      fromProjectName,
      fromScopeName,
      toScopeName: parsedArgs.toScopeName,
      dryRun: parsedArgs.dryRun,
      removeGit: parsedArgs.removeGit,
      keepGit: parsedArgs.keepGit,
    });

    printResult({
      result,
      projectName: parsedArgs.projectName,
      fromProjectName,
      fromScopeName,
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
