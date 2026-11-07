import fs from "node:fs";
import path from "node:path";

import { parse } from "dotenv";

import { databaseName } from "./prisma-target";

const modeKeys = new Set(["NODE_ENV", "E2E", "VERCEL_ENV"]);

export function loadPrismaEnv(root: string): void {
  const { E2E, NODE_ENV, VERCEL_ENV } = process.env;
  const hosted = VERCEL_ENV === "preview" || VERCEL_ENV === "production";
  const mode = E2E === "true" ? "e2e" : NODE_ENV === "test" ? "test" : "local";

  if (hosted) {
    if (mode !== "local") throw new Error("Test and E2E cannot run on Vercel deployments.");
    return;
  }

  const files = mode === "test" ? [".env.test"] : [".env.local", ".env"];
  const overrideFile = mode === "local" ? undefined : `.env.${mode}.local`;
  if (overrideFile) files.push(overrideFile);

  for (const name of files) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;

    for (const [key, value] of Object.entries(parse(fs.readFileSync(file)))) {
      if (modeKeys.has(key)) continue;
      if (name === overrideFile || process.env[key] === undefined) process.env[key] = value;
    }
  }

  if (mode !== "local") {
    const suffix = `_${mode}`;
    const direct = databaseName("DIRECT_URL");
    if (!direct.endsWith(suffix))
      throw new Error(`DIRECT_URL must name a database ending in ${suffix}.`);

    if (process.env.DATABASE_URL !== undefined && databaseName("DATABASE_URL") !== direct) {
      throw new Error(`DATABASE_URL and DIRECT_URL must name the same ${mode} database.`);
    }
  }
}
