import { createHash } from "node:crypto";
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
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
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

const SEED_UUID_PREFIX = "00000000-0000-4000-8000";

function createSeedUuid(sequence: number) {
  return `${SEED_UUID_PREFIX}-${String(sequence).padStart(12, "0")}`;
}

const SEED_USERS = [
  {
    key: "admin",
    id: createSeedUuid(1),
    email: "admin@example.com",
    name: "관리자",
    avatarUrl: "https://example.com/avatars/admin.png",
    nickname: "admin",
    role: "ADMIN",
    status: "ACTIVE",
    lastLoginAt: now,
    deletedAt: null,
  },
  {
    key: "manager",
    id: createSeedUuid(2),
    email: "manager@example.com",
    name: "운영 관리자",
    avatarUrl: "https://example.com/avatars/manager.png",
    nickname: "manager",
    role: "ADMIN",
    status: "ACTIVE",
    lastLoginAt: addDays(now, -1),
    deletedAt: null,
  },
  {
    key: "normal01",
    id: createSeedUuid(3),
    email: "user01@example.com",
    name: "일반 사용자 01",
    avatarUrl: "https://example.com/avatars/user01.png",
    nickname: "normal_user_01",
    role: "USER",
    status: "ACTIVE",
    lastLoginAt: addDays(now, -1),
    deletedAt: null,
  },
  {
    key: "normal02",
    id: createSeedUuid(4),
    email: "user02@example.com",
    name: "일반 사용자 02",
    avatarUrl: "https://example.com/avatars/user02.png",
    nickname: "normal_user_02",
    role: "USER",
    status: "ACTIVE",
    lastLoginAt: addDays(now, -2),
    deletedAt: null,
  },
  {
    key: "normal03",
    id: createSeedUuid(5),
    email: "user03@example.com",
    name: "일반 사용자 03",
    avatarUrl: "https://example.com/avatars/user03.png",
    nickname: "normal_user_03",
    role: "USER",
    status: "ACTIVE",
    lastLoginAt: addDays(now, -3),
    deletedAt: null,
  },
  {
    key: "normal04",
    id: createSeedUuid(6),
    email: "user04@example.com",
    name: "일반 사용자 04",
    avatarUrl: null,
    nickname: "normal_user_04",
    role: "USER",
    status: "ACTIVE",
    lastLoginAt: addDays(now, -4),
    deletedAt: null,
  },
  {
    key: "normal05",
    id: createSeedUuid(7),
    email: "user05@example.com",
    name: "일반 사용자 05",
    avatarUrl: null,
    nickname: "normal_user_05",
    role: "USER",
    status: "ACTIVE",
    lastLoginAt: addDays(now, -5),
    deletedAt: null,
  },
  {
    key: "suspended",
    id: createSeedUuid(8),
    email: "suspended@example.com",
    name: "정지 사용자",
    avatarUrl: null,
    nickname: "suspended_user",
    role: "USER",
    status: "SUSPENDED",
    lastLoginAt: addDays(now, -7),
    deletedAt: null,
  },
  {
    key: "banned",
    id: createSeedUuid(9),
    email: "banned@example.com",
    name: "차단 사용자",
    avatarUrl: null,
    nickname: "banned_user",
    role: "USER",
    status: "BANNED",
    lastLoginAt: addDays(now, -14),
    deletedAt: null,
  },
  {
    key: "deleted",
    id: createSeedUuid(10),
    email: "deleted@example.com",
    name: "삭제 사용자",
    avatarUrl: null,
    nickname: "deleted_user",
    role: "USER",
    status: "DELETED",
    lastLoginAt: addDays(now, -30),
    deletedAt: addDays(now, -1),
  },
] as const;

type SeedUserKey = (typeof SEED_USERS)[number]["key"];

const SEED_OAUTH_ACCOUNTS = [
  {
    id: createSeedUuid(101),
    provider: "GOOGLE",
    providerUserId: "seed-google-admin",
    userKey: "admin",
  },
  {
    id: createSeedUuid(102),
    provider: "GOOGLE",
    providerUserId: "seed-google-manager",
    userKey: "manager",
  },
  {
    id: createSeedUuid(103),
    provider: "NAVER",
    providerUserId: "seed-naver-user-01",
    userKey: "normal01",
  },
  {
    id: createSeedUuid(104),
    provider: "KAKAO",
    providerUserId: "seed-kakao-user-02",
    userKey: "normal02",
  },
  {
    id: createSeedUuid(105),
    provider: "GOOGLE",
    providerUserId: "seed-google-user-03",
    userKey: "normal03",
  },
  {
    id: createSeedUuid(106),
    provider: "NAVER",
    providerUserId: "seed-naver-user-04",
    userKey: "normal04",
  },
  {
    id: createSeedUuid(107),
    provider: "KAKAO",
    providerUserId: "seed-kakao-user-05",
    userKey: "normal05",
  },
  {
    id: createSeedUuid(108),
    provider: "GOOGLE",
    providerUserId: "seed-google-suspended",
    userKey: "suspended",
  },
  {
    id: createSeedUuid(109),
    provider: "NAVER",
    providerUserId: "seed-naver-banned",
    userKey: "banned",
  },
  {
    id: createSeedUuid(110),
    provider: "KAKAO",
    providerUserId: "seed-kakao-deleted",
    userKey: "deleted",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  provider: "GOOGLE" | "NAVER" | "KAKAO";
  providerUserId: string;
  userKey: SeedUserKey;
}>;

const SEED_CONTENTS = [
  {
    id: createSeedUuid(201),
    title: "공개 콘텐츠 01",
    content:
      "일반 사용자 01이 작성한 공개 콘텐츠입니다. 기본 목록 노출과 상세 조회 테스트에 사용할 수 있습니다.",
    status: "PUBLISHED",
    authorKey: "normal01",
  },
  {
    id: createSeedUuid(202),
    title: "공개 콘텐츠 02",
    content:
      "일반 사용자 02가 작성한 공개 콘텐츠입니다. 페이지네이션과 정렬 테스트에 사용할 수 있습니다.",
    status: "PUBLISHED",
    authorKey: "normal02",
  },
  {
    id: createSeedUuid(203),
    title: "공개 콘텐츠 03",
    content:
      "일반 사용자 03이 작성한 공개 콘텐츠입니다. 작성자 정보 표시 테스트에 사용할 수 있습니다.",
    status: "PUBLISHED",
    authorKey: "normal03",
  },
  {
    id: createSeedUuid(204),
    title: "공개 콘텐츠 04",
    content:
      "일반 사용자 04가 작성한 공개 콘텐츠입니다. 사용자별 콘텐츠 목록 테스트에 사용할 수 있습니다.",
    status: "PUBLISHED",
    authorKey: "normal04",
  },
  {
    id: createSeedUuid(205),
    title: "공개 콘텐츠 05",
    content:
      "일반 사용자 05가 작성한 공개 콘텐츠입니다. 검색어 필터링 테스트에 사용할 수 있습니다.",
    status: "PUBLISHED",
    authorKey: "normal05",
  },
  {
    id: createSeedUuid(206),
    title: "관리자 공지 콘텐츠",
    content:
      "관리자가 작성한 공개 공지 콘텐츠입니다. 관리자 작성 콘텐츠 표시 테스트에 사용할 수 있습니다.",
    status: "PUBLISHED",
    authorKey: "admin",
  },
  {
    id: createSeedUuid(207),
    title: "숨김 콘텐츠 01",
    content:
      "숨김 상태의 콘텐츠입니다. 일반 사용자 화면에서 제외되는지 확인할 때 사용할 수 있습니다.",
    status: "HIDDEN",
    authorKey: "normal01",
  },
  {
    id: createSeedUuid(208),
    title: "숨김 콘텐츠 02",
    content:
      "운영 관리자가 숨긴 콘텐츠입니다. 관리자 화면의 상태 변경 테스트에 사용할 수 있습니다.",
    status: "HIDDEN",
    authorKey: "manager",
  },
  {
    id: createSeedUuid(209),
    title: "삭제된 콘텐츠 01",
    content: "삭제 상태로 표시되는 콘텐츠입니다. 소프트 삭제 필터링 테스트에 사용할 수 있습니다.",
    status: "DELETED",
    authorKey: "normal02",
  },
  {
    id: createSeedUuid(210),
    title: "삭제된 콘텐츠 02",
    content:
      "관리자에 의해 삭제된 콘텐츠입니다. 관리자 복구/삭제 정책 테스트에 사용할 수 있습니다.",
    status: "DELETED",
    authorKey: "manager",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  title: string;
  content: string;
  status: "PUBLISHED" | "HIDDEN" | "DELETED";
  authorKey: SeedUserKey;
}>;

const SEED_SESSIONS = [
  {
    id: createSeedUuid(301),
    tokenHash: hashToken("seed-admin-active-session-token"),
    expiresAt: addDays(now, 30),
    revokedAt: null,
    ipAddress: "127.0.0.1",
    userAgent: "Seed Admin Active Session",
    userKey: "admin",
  },
  {
    id: createSeedUuid(302),
    tokenHash: hashToken("seed-manager-active-session-token"),
    expiresAt: addDays(now, 30),
    revokedAt: null,
    ipAddress: "127.0.0.1",
    userAgent: "Seed Manager Active Session",
    userKey: "manager",
  },
  {
    id: createSeedUuid(303),
    tokenHash: hashToken("seed-user-01-active-session-token"),
    expiresAt: addDays(now, 30),
    revokedAt: null,
    ipAddress: "127.0.0.1",
    userAgent: "Seed User 01 Active Session",
    userKey: "normal01",
  },
  {
    id: createSeedUuid(304),
    tokenHash: hashToken("seed-user-02-active-session-token"),
    expiresAt: addDays(now, 14),
    revokedAt: null,
    ipAddress: "127.0.0.1",
    userAgent: "Seed User 02 Active Session",
    userKey: "normal02",
  },
  {
    id: createSeedUuid(305),
    tokenHash: hashToken("seed-user-03-active-session-token"),
    expiresAt: addDays(now, 7),
    revokedAt: null,
    ipAddress: "127.0.0.1",
    userAgent: "Seed User 03 Active Session",
    userKey: "normal03",
  },
  {
    id: createSeedUuid(306),
    tokenHash: hashToken("seed-user-04-expired-session-token"),
    expiresAt: addDays(now, -1),
    revokedAt: null,
    ipAddress: "127.0.0.1",
    userAgent: "Seed User 04 Expired Session",
    userKey: "normal04",
  },
  {
    id: createSeedUuid(307),
    tokenHash: hashToken("seed-user-05-expired-session-token"),
    expiresAt: addDays(now, -3),
    revokedAt: null,
    ipAddress: "127.0.0.1",
    userAgent: "Seed User 05 Expired Session",
    userKey: "normal05",
  },
  {
    id: createSeedUuid(308),
    tokenHash: hashToken("seed-user-01-revoked-session-token"),
    expiresAt: addDays(now, 30),
    revokedAt: addDays(now, -1),
    ipAddress: "127.0.0.1",
    userAgent: "Seed User 01 Revoked Session",
    userKey: "normal01",
  },
  {
    id: createSeedUuid(309),
    tokenHash: hashToken("seed-suspended-active-session-token"),
    expiresAt: addDays(now, 30),
    revokedAt: null,
    ipAddress: "127.0.0.1",
    userAgent: "Seed Suspended Active Session",
    userKey: "suspended",
  },
  {
    id: createSeedUuid(310),
    tokenHash: hashToken("seed-banned-revoked-session-token"),
    expiresAt: addDays(now, 30),
    revokedAt: addDays(now, -7),
    ipAddress: "127.0.0.1",
    userAgent: "Seed Banned Revoked Session",
    userKey: "banned",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  ipAddress: string;
  userAgent: string;
  userKey: SeedUserKey;
}>;

function getSeedUser(
  usersByKey: Map<SeedUserKey, { email: string; id: string }>,
  key: SeedUserKey,
) {
  const user = usersByKey.get(key);

  if (!user) {
    throw new Error(`Seed user not found: ${key}`);
  }

  return user;
}

async function main() {
  console.info("Seed started.");

  await prisma.$transaction(async (transaction) => {
    const usersByKey = new Map<SeedUserKey, { email: string; id: string }>();

    for (const user of SEED_USERS) {
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

    for (const oauthAccount of SEED_OAUTH_ACCOUNTS) {
      const user = getSeedUser(usersByKey, oauthAccount.userKey);

      await transaction.userOAuthAccount.upsert({
        where: {
          id: oauthAccount.id,
        },
        create: {
          id: oauthAccount.id,
          email: user.email,
          provider: oauthAccount.provider,
          providerUserId: oauthAccount.providerUserId,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
        update: {
          email: user.email,
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

    for (const content of SEED_CONTENTS) {
      const author = getSeedUser(usersByKey, content.authorKey);

      await transaction.content.upsert({
        where: {
          id: content.id,
        },
        create: {
          id: content.id,
          title: content.title,
          content: content.content,
          status: content.status,
          author: {
            connect: {
              id: author.id,
            },
          },
        },
        update: {
          title: content.title,
          content: content.content,
          status: content.status,
          author: {
            connect: {
              id: author.id,
            },
          },
        },
      });
    }

    for (const session of SEED_SESSIONS) {
      const user = getSeedUser(usersByKey, session.userKey);

      await transaction.userSession.upsert({
        where: {
          id: session.id,
        },
        create: {
          id: session.id,
          tokenHash: session.tokenHash,
          expiresAt: session.expiresAt,
          revokedAt: session.revokedAt,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
        update: {
          tokenHash: session.tokenHash,
          expiresAt: session.expiresAt,
          revokedAt: session.revokedAt,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }
  });

  console.info("Seed completed.");
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectScriptPrisma();
  });
