import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { parse } from "dotenv";

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
    // URL parsing errors can include credentials.
  }

  throw new Error(`${key} must point to a PostgreSQL database ending in _e2e.`);
}

export function loadSeedEnv(mode: "development" | "e2e", root: string): void {
  const { E2E, NODE_ENV, VERCEL_ENV } = process.env;
  if (VERCEL_ENV === "preview" || VERCEL_ENV === "production") {
    throw new Error("Seed cannot run in a Vercel deployment environment.");
  }
  if (
    mode === "development" &&
    (NODE_ENV === "production" || NODE_ENV === "test" || E2E === "true")
  ) {
    throw new Error("Development seed requires a local development environment.");
  }
  if (mode === "e2e" && E2E !== "true") {
    throw new Error("E2E seed requires E2E=true before loading environment files.");
  }

  const files = [".env.local", ".env"];
  if (mode === "e2e") files.push(".env.e2e.local");

  for (const name of files) {
    const file = path.join(root, name);
    if (!existsSync(file)) continue;

    for (const [key, value] of Object.entries(parse(readFileSync(file)))) {
      if (["NODE_ENV", "E2E", "VERCEL_ENV"].includes(key)) continue;
      if (name === ".env.e2e.local" || process.env[key] === undefined) process.env[key] = value;
    }
  }

  if (mode === "e2e" && e2eDatabaseName("DATABASE_URL") !== e2eDatabaseName("DIRECT_URL")) {
    throw new Error("DATABASE_URL and DIRECT_URL must name the same E2E database.");
  }
}
