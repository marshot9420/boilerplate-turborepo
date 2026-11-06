import { createHash, randomBytes, randomUUID } from "node:crypto";

import { test as base, expect, type Browser, type Page, type TestInfo } from "@playwright/test";
import type { Content } from "@prisma/client";

import { disconnectScriptPrisma, scriptPrisma } from "@repo/database/script-client";

interface TestActor {
  id: string;
  email: string;
  nickname: string;
  token: string;
  expiresAt: Date;
}

interface TestFixtures {
  actor: TestActor;
  author: TestActor;
  reader: TestActor;
  readerPage: Page;
  userPage: Page;
  content: Content;
}

interface WorkerFixtures {
  database: typeof scriptPrisma;
}

function requiredEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) throw new Error(`${key} is required for E2E`);
  return value;
}

async function provideActor(
  database: typeof scriptPrisma,
  role: "USER" | "ADMIN",
  runTest: (actor: TestActor) => Promise<void>,
) {
  const id = randomUUID();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const user = await database.user.create({
    data: {
      id,
      email: `e2e-admin-${id}@example.com`,
      nickname: `e2e_${id.replaceAll("-", "")}`,
      name: "E2E 관리 흐름 사용자",
      role,
      status: "ACTIVE",
      sessions: {
        create: {
          tokenHash: createHash("sha256").update(token).digest("hex"),
          expiresAt,
          userAgent: "Playwright moderation E2E",
        },
      },
    },
  });

  try {
    await runTest({ id: user.id, email: user.email, nickname: user.nickname, token, expiresAt });
  } finally {
    await database.content.deleteMany({ where: { authorId: id } });
    await database.user.delete({ where: { id } });
  }
}

function sessionCookie(actor: TestActor, baseURL: string) {
  return {
    name: requiredEnv("AUTH_SESSION_COOKIE_NAME"),
    value: actor.token,
    url: baseURL,
    expires: Math.floor(actor.expiresAt.getTime() / 1000),
    httpOnly: true,
    sameSite: "Lax" as const,
    secure: new URL(baseURL).protocol === "https:",
  };
}

async function openActorPage(
  browser: Browser,
  actor: TestActor,
  baseURL: string,
  testInfo: TestInfo,
) {
  const device = testInfo.project.use;
  const context = await browser.newContext({
    baseURL,
    viewport: device.viewport,
    userAgent: device.userAgent,
    deviceScaleFactor: device.deviceScaleFactor,
    isMobile: device.isMobile,
    hasTouch: device.hasTouch,
  });
  await context.addCookies([sessionCookie(actor, baseURL)]);
  return context.newPage();
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  database: [
    async ({ playwright: _playwright }, runTest) => {
      const databaseName = new URL(requiredEnv("DATABASE_URL")).pathname.slice(1);
      if (!/(?:^|[_-])e2e$/i.test(databaseName)) {
        throw new Error("E2E tests require a dedicated database whose name ends with _e2e.");
      }
      try {
        await runTest(scriptPrisma);
      } finally {
        await disconnectScriptPrisma();
      }
    },
    { scope: "worker" },
  ],
  actor: async ({ database }, runTest) => provideActor(database, "ADMIN", runTest),
  author: async ({ database }, runTest) => provideActor(database, "USER", runTest),
  reader: async ({ database }, runTest) => provideActor(database, "USER", runTest),
  page: async ({ page, actor, baseURL }, runTest) => {
    if (!baseURL) throw new Error("Admin E2E baseURL is required.");
    await page.context().addCookies([sessionCookie(actor, baseURL)]);
    await runTest(page);
  },
  readerPage: async ({ browser, reader }, runTest, testInfo) => {
    const port = Number(process.env.WEB_E2E_PORT ?? 3100);
    const baseURL = process.env.WEB_E2E_BASE_URL ?? `http://localhost:${port}`;
    const page = await openActorPage(browser, reader, baseURL, testInfo);
    try {
      await runTest(page);
    } finally {
      await page.context().close();
    }
  },
  userPage: async ({ browser, reader, baseURL }, runTest, testInfo) => {
    if (!baseURL) throw new Error("Admin E2E baseURL is required.");
    const page = await openActorPage(browser, reader, baseURL, testInfo);
    try {
      await runTest(page);
    } finally {
      await page.context().close();
    }
  },
  content: async ({ database, author }, runTest) => {
    const suffix = randomUUID();
    await runTest(
      await database.content.create({
        data: {
          title: `E2E 관리자 콘텐츠 ${suffix}`,
          content: `E2E 공개 숨김 검증 본문 ${suffix}`,
          status: "PUBLISHED",
          authorId: author.id,
        },
      }),
    );
  },
});

export { expect };
