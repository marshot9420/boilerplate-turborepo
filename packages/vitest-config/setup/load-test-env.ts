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

if (!process.env.NEXT_PUBLIC_APP_URL) {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) as {
      name?: string;
    };

    if (packageJson.name === "admin") {
      process.env.NEXT_PUBLIC_APP_URL = process.env.ADMIN_APP_URL;
    } else {
      process.env.NEXT_PUBLIC_APP_URL = process.env.WEB_APP_URL;
    }
  }
}
