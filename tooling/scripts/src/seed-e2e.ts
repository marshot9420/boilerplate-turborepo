import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "dotenv";

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(currentDir, "../../..");

const originalEnvKeys = new Set(Object.keys(process.env));

function applyEnvFile(filePath: string, options?: { overrideLoaded?: boolean }) {
  if (!existsSync(filePath)) {
    return;
  }

  const parsedEnv = parse(readFileSync(filePath));

  for (const [key, value] of Object.entries(parsedEnv)) {
    const isOriginalEnv = originalEnvKeys.has(key);

    if (isOriginalEnv) {
      continue;
    }

    if (process.env[key] === undefined || options?.overrideLoaded === true) {
      process.env[key] = value;
    }
  }
}

function loadEnv() {
  applyEnvFile(resolve(rootDir, ".env"));
  applyEnvFile(resolve(rootDir, ".env.local"), { overrideLoaded: true });
  applyEnvFile(resolve(rootDir, ".env.e2e.local"), { overrideLoaded: true });
}

function withoutSeedKey<TData extends { key: string }>(data: TData): Omit<TData, "key"> {
  const { key: _key, ...rest } = data;

  return rest;
}

function withoutSeedKeyAndId<TData extends { id: string; key: string }>(
  data: TData,
): Omit<TData, "id" | "key"> {
  const { id: _id, key: _key, ...rest } = data;

  return rest;
}

loadEnv();

const { disconnectScriptPrisma, scriptPrisma } = await import("@repo/database/script-client");

const prisma = scriptPrisma;

const now = new Date();

const E2E_UUID_PREFIX = "00000000-0000-4000-8000";

function createE2EUuid(sequence: number) {
  return `${E2E_UUID_PREFIX}-${String(sequence).padStart(12, "0")}`;
}

const E2E_USERS = [
  {
    key: "admin",
    id: createE2EUuid(900001),
    email: "e2e-admin@example.com",
    name: "E2E 관리자",
    avatarUrl: "https://example.com/avatars/e2e-admin.png",
    nickname: "e2e_admin",
    role: "ADMIN",
    status: "ACTIVE",
    lastLoginAt: now,
    deletedAt: null,
  },
  {
    key: "user",
    id: createE2EUuid(900002),
    email: "e2e-user@example.com",
    name: "E2E 사용자",
    avatarUrl: "https://example.com/avatars/e2e-user.png",
    nickname: "e2e_user",
    role: "USER",
    status: "ACTIVE",
    lastLoginAt: now,
    deletedAt: null,
  },
] as const;

type E2EUserKey = (typeof E2E_USERS)[number]["key"];

const E2E_OAUTH_ACCOUNTS = [
  {
    id: createE2EUuid(900101),
    email: "e2e-admin@example.com",
    provider: "GOOGLE",
    providerUserId: "e2e-google-admin",
    userKey: "admin",
  },
  {
    id: createE2EUuid(900102),
    email: "e2e-user@example.com",
    provider: "GOOGLE",
    providerUserId: "e2e-google-user",
    userKey: "user",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  email: string;
  provider: "GOOGLE";
  providerUserId: string;
  userKey: E2EUserKey;
}>;

function getE2EUser(usersByKey: Map<E2EUserKey, { email: string; id: string }>, key: E2EUserKey) {
  const user = usersByKey.get(key);

  if (!user) {
    throw new Error(`E2E seed user not found: ${key}`);
  }

  return user;
}

async function main() {
  console.info("E2E seed started.");

  await prisma.$transaction(async (transaction) => {
    const usersByKey = new Map<E2EUserKey, { email: string; id: string }>();

    for (const user of E2E_USERS) {
      const createdUser = await transaction.user.upsert({
        where: {
          id: user.id,
        },
        create: withoutSeedKey(user),
        update: withoutSeedKeyAndId(user),
      });

      usersByKey.set(user.key, {
        id: createdUser.id,
        email: createdUser.email,
      });
    }

    for (const oauthAccount of E2E_OAUTH_ACCOUNTS) {
      const user = getE2EUser(usersByKey, oauthAccount.userKey);

      await transaction.userOAuthAccount.upsert({
        where: {
          id: oauthAccount.id,
        },
        create: {
          id: oauthAccount.id,
          email: oauthAccount.email,
          provider: oauthAccount.provider,
          providerUserId: oauthAccount.providerUserId,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
        update: {
          email: oauthAccount.email,
          provider: oauthAccount.provider,
          providerUserId: oauthAccount.providerUserId,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }
  });

  console.info("E2E seed completed.");
}

main()
  .catch((error: unknown) => {
    console.error("E2E seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectScriptPrisma();
  });
