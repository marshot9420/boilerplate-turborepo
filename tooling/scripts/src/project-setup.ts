import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

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

const targetFilenames = new Set([".npmrc", ".nvmrc", "Dockerfile"]);

export interface ReplaceProjectTextResult {
  checkedFileCount: number;
  changedFileCount: number;
  changedFiles: string[];
}

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

export function normalizeProjectName(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeScopeName(value: string): string {
  return value.trim().replace(/^@/, "");
}

export function toScope(scopeName: string): string {
  return `@${scopeName}`;
}

export function toSnakeProjectName(projectName: string): string {
  return projectName.replaceAll("-", "_");
}

export function validateProjectName(projectName: string): void {
  if (!projectName) {
    throw new Error("[project-setup] project name is required.");
  }

  if (!/^[a-z0-9][a-z0-9-]*$/.test(projectName)) {
    throw new Error(
      [
        `[project-setup] invalid project name: ${projectName}`,
        "Use lowercase letters, numbers, and hyphens only.",
        "Example: mars, athena-doctrine, my-company",
      ].join("\n"),
    );
  }
}

export function validateScopeName(scopeName: string): void {
  if (!scopeName) {
    throw new Error("[project-setup] scope name is required.");
  }

  if (!/^[a-z0-9][a-z0-9-]*$/.test(scopeName)) {
    throw new Error(
      [
        `[project-setup] invalid scope name: ${scopeName}`,
        "Use lowercase letters, numbers, and hyphens only.",
        "Example: mars, athena, my-company",
      ].join("\n"),
    );
  }
}

export async function exists(filePath: string): Promise<boolean> {
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

function shouldIgnoreDirectory(directoryName: string): boolean {
  return ignoredDirectories.has(directoryName);
}

function isEnvFile(fileName: string): boolean {
  return fileName === ".env" || fileName.startsWith(".env.");
}

function shouldProcessFile(filePath: string): boolean {
  const fileName = path.basename(filePath);

  if (ignoredFilenames.has(fileName)) {
    return false;
  }

  if (isEnvFile(fileName)) {
    return true;
  }

  if (targetFilenames.has(fileName)) {
    return true;
  }

  const extension = path.extname(filePath);

  return targetExtensions.has(extension);
}

export async function collectProjectTextFiles(directoryPath: string): Promise<string[]> {
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

      files.push(...(await collectProjectTextFiles(entryPath)));

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

export async function replaceProjectText(params: {
  rootPath: string;
  dryRun: boolean;
  transform: (content: string) => string;
}): Promise<ReplaceProjectTextResult> {
  const { rootPath, dryRun, transform } = params;

  const rootStat = await stat(rootPath);

  if (!rootStat.isDirectory()) {
    throw new Error(`[project-setup] root path is not a directory: ${rootPath}`);
  }

  const files = await collectProjectTextFiles(rootPath);

  const changedFiles: string[] = [];

  for (const filePath of files) {
    const content = await readFile(filePath, "utf8");
    const nextContent = transform(content);

    if (content === nextContent) {
      continue;
    }

    if (!dryRun) {
      await writeFile(filePath, nextContent);
    }

    changedFiles.push(path.relative(rootPath, filePath));
  }

  changedFiles.sort((a, b) => a.localeCompare(b));

  return {
    checkedFileCount: files.length,
    changedFileCount: changedFiles.length,
    changedFiles,
  };
}

export async function findRepositoryRoot(startPath: string): Promise<string> {
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
      throw new Error("[project-setup] failed to find repository root.");
    }

    currentPath = parentPath;
  }
}

async function readPackageName(packageJsonPath: string): Promise<string> {
  const content = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(content) as {
    name?: unknown;
  };

  if (typeof packageJson.name !== "string" || !packageJson.name.trim()) {
    throw new Error(`[project-setup] package name is missing: ${packageJsonPath}`);
  }

  return packageJson.name.trim();
}

export async function readCurrentProjectName(rootPath: string): Promise<string> {
  const packageName = await readPackageName(path.join(rootPath, "package.json"));

  return normalizeProjectName(packageName);
}

export async function readCurrentScopeName(rootPath: string): Promise<string> {
  const scriptsPackageName = await readPackageName(
    path.join(rootPath, "tooling", "scripts", "package.json"),
  );

  const match = /^@([^/]+)\/[^/]+$/.exec(scriptsPackageName);
  const scopeName = match?.[1];

  if (!scopeName) {
    throw new Error(
      [
        `[project-setup] failed to resolve current package scope from: ${scriptsPackageName}`,
        "Expected a scoped package name such as @repo/scripts.",
      ].join("\n"),
    );
  }

  return normalizeScopeName(scopeName);
}
