import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

const workspaceRoot = path.resolve(process.cwd(), "../..");

const envFiles =
  process.env.E2E === "true"
    ? [".env", ".env.local", ".env.e2e.local"]
    : process.env.NODE_ENV === "test"
      ? [".env.test", ".env.test.local"]
      : [".env", ".env.local"];

for (const envFile of envFiles) {
  const envPath = path.join(workspaceRoot, envFile);

  if (fs.existsSync(envPath)) {
    dotenv.config({
      path: envPath,
      override: true,
    });
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env("DIRECT_URL"),
  },
});
