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

function e2eDatabaseName(key: "DATABASE_URL" | "DIRECT_URL"): string {
  try {
    const url = new URL(process.env[key] ?? "");
    const pathName = url.pathname.slice(1);
    const name = decodeURIComponent(pathName);

    if (
      ["postgres:", "postgresql:"].includes(url.protocol) &&
      url.hostname &&
      name === decodeURI(pathName) &&
      !name.includes("/") &&
      !name.includes("\0") &&
      name.endsWith("_e2e")
    ) {
      return name;
    }
  } catch {
    // Invalid URL errors can include the connection string.
  }

  throw new Error(`${key} must point to a PostgreSQL database ending in _e2e.`);
}

export function loadPlaywrightEnv(): void {
  if (process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "production") {
    throw new Error("Playwright E2E cannot run in a Vercel deployment environment.");
  }

  const root = resolveWorkspaceRoot(process.cwd());

  for (const name of [".env.local", ".env", ".env.e2e.local"]) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;

    for (const [key, value] of Object.entries(dotenv.parse(fs.readFileSync(file)))) {
      if (["NODE_ENV", "E2E", "VERCEL_ENV"].includes(key)) continue;

      if (name === ".env.e2e.local" || process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }

  if (e2eDatabaseName("DATABASE_URL") !== e2eDatabaseName("DIRECT_URL")) {
    throw new Error("DATABASE_URL and DIRECT_URL must name the same E2E database.");
  }

  process.env.E2E = "true";
}
