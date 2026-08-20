import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";

function resolveWorkspaceRoot(startDir: string): string {
  let currentDir = startDir;

  while (true) {
    const workspaceFile = path.join(currentDir, "pnpm-workspace.yaml");

    if (fs.existsSync(workspaceFile)) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);

    if (parentDir === currentDir) {
      throw new Error("pnpm-workspace.yaml을 찾을 수 없습니다.");
    }

    currentDir = parentDir;
  }
}

export function loadPlaywrightEnv(): void {
  const workspaceRoot = resolveWorkspaceRoot(process.cwd());

  const envFiles = [
    {
      fileName: ".env.local",
      override: false,
    },
    {
      fileName: ".env.e2e.local",
      override: true,
    },
  ] as const;

  for (const { fileName, override } of envFiles) {
    const envPath = path.join(workspaceRoot, fileName);

    if (!fs.existsSync(envPath)) {
      continue;
    }

    dotenv.config({
      path: envPath,
      override,
    });
  }
}
