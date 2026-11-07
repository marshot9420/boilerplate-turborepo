import { fileURLToPath } from "node:url";

import { defineConfig } from "prisma/config";

import { loadPrismaEnv } from "./prisma-env";

loadPrismaEnv(fileURLToPath(new URL("../../", import.meta.url)));

const directUrl = process.env.DIRECT_URL;
if (!directUrl?.trim()) throw new Error("DIRECT_URL is required.");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: directUrl },
});
