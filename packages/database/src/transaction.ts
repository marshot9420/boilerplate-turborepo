import type { PrismaClient } from "@prisma/client";

import { prisma } from "./client";

export type TransactionClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export async function transaction<T>(
  callback: (database: TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(callback);
}
