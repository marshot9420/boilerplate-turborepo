import { access, readdir } from "node:fs/promises";
import path from "node:path";

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function findWorkspaceRoot(startPath = process.cwd()): Promise<string> {
  let currentPath = path.resolve(startPath);

  while (true) {
    const workspacePath = path.join(currentPath, "pnpm-workspace.yaml");

    if (await exists(workspacePath)) {
      return currentPath;
    }

    const parentPath = path.dirname(currentPath);

    if (parentPath === currentPath) {
      throw new Error("[generators] pnpm workspace root could not be found.");
    }

    currentPath = parentPath;
  }
}

export async function findWorkspaceAppNames(workspaceRoot: string): Promise<string[]> {
  const appsPath = path.join(workspaceRoot, "apps");

  const entries = await readdir(appsPath, {
    withFileTypes: true,
  });

  const appNames: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const packageJsonPath = path.join(appsPath, entry.name, "package.json");

    if (!(await exists(packageJsonPath))) {
      continue;
    }

    appNames.push(entry.name);
  }

  return appNames.sort((a, b) => a.localeCompare(b));
}
