import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";

export function loadPlaywrightEnv() {
  const workspaceRoot = path.resolve(process.cwd(), "../..");

  const envFiles = [".env.local", ".env.e2e.local"];

  for (const envFile of envFiles) {
    const envPath = path.join(workspaceRoot, envFile);

    if (!fs.existsSync(envPath)) {
      continue;
    }

    dotenv.config({
      path: envPath,
      override: envFile === ".env.e2e.local",
    });
  }
}
