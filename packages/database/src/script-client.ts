import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL 환경변수가 설정되어 있지 않습니다.");
  }

  return databaseUrl;
}

const globalForPrisma = globalThis as unknown as {
  scriptPrisma?: PrismaClient;
  scriptPrismaPool?: Pool;
};

const pool =
  globalForPrisma.scriptPrismaPool ??
  new Pool({
    connectionString: getDatabaseUrl(),
    max: 3,
  });

const adapter = new PrismaPg(pool);

export const scriptPrisma =
  globalForPrisma.scriptPrisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.scriptPrisma = scriptPrisma;
  globalForPrisma.scriptPrismaPool = pool;
}

export async function disconnectScriptPrisma() {
  await scriptPrisma.$disconnect();
  await pool.end();
}
