import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";

process.env.NODE_ENV = "test";

let currentDir = process.cwd();
let workspaceRoot = currentDir;

while (currentDir !== path.dirname(currentDir)) {
  const workspaceFile = path.join(currentDir, "pnpm-workspace.yaml");

  if (fs.existsSync(workspaceFile)) {
    workspaceRoot = currentDir;
    break;
  }

  currentDir = path.dirname(currentDir);
}

const envFiles = [".env.test", ".env.test.local"];

for (const envFile of envFiles) {
  const envPath = path.join(workspaceRoot, envFile);

  if (fs.existsSync(envPath)) {
    dotenv.config({
      path: envPath,
      override: true,
    });
  }
}
