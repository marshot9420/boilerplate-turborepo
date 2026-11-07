import { defineConfig } from "prisma/config";

import { databaseName } from "./prisma-target";

const { E2E, NODE_ENV, VERCEL_ENV, DIRECT_URL } = process.env;

if (E2E === "true" || NODE_ENV === "test" || VERCEL_ENV === "development") {
  throw new Error("Deployment database commands cannot run in Test, E2E or Vercel Development.");
}

databaseName("DIRECT_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: DIRECT_URL },
});
