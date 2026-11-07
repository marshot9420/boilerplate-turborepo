import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";

if (process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "production") {
  throw new Error("Tests cannot run in a Vercel deployment environment.");
}

process.env.NODE_ENV = "test";

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

const workspaceRoot = resolveWorkspaceRoot(process.cwd());

const envFiles = [
  {
    fileName: ".env.test",
    override: false,
  },
  {
    fileName: ".env.test.local",
    override: true,
  },
] as const;

for (const { fileName, override } of envFiles) {
  const envPath = path.join(workspaceRoot, fileName);

  if (!fs.existsSync(envPath)) {
    continue;
  }

  for (const [key, value] of Object.entries(dotenv.parse(fs.readFileSync(envPath)))) {
    if (["NODE_ENV", "E2E", "VERCEL_ENV"].includes(key)) continue;
    if (override || process.env[key] === undefined) process.env[key] = value;
  }
}
