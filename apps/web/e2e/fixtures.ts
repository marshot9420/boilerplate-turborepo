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
  otherActor: TestActor;
  otherUserPage: Page;
  content: Content;
  hiddenContent: Content;
  otherUserContent: Content;
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
  runTest: (actor: TestActor) => Promise<void>,
) {
  const id = randomUUID();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const user = await database.user.create({
    data: {
      id,
      email: `e2e-web-${id}@example.com`,
      nickname: `e2e_${id.replaceAll("-", "")}`,
      name: "E2E 콘텐츠 사용자",
      role: "USER",
      status: "ACTIVE",
      sessions: {
        create: {
          tokenHash: createHash("sha256").update(token).digest("hex"),
          expiresAt,
          userAgent: "Playwright content E2E",
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

function createContent(database: typeof scriptPrisma, authorId: string, hidden = false) {
  const suffix = randomUUID();
  return database.content.create({
    data: {
      title: `E2E 콘텐츠 ${suffix}`,
      content: `E2E 접근 제어 검증 본문 ${suffix}`,
      status: hidden ? "HIDDEN" : "PUBLISHED",
      authorId,
    },
  });
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
  actor: async ({ database }, runTest) => provideActor(database, runTest),
  otherActor: async ({ database }, runTest) => provideActor(database, runTest),
  page: async ({ page, actor, baseURL }, runTest) => {
    if (!baseURL) throw new Error("Web E2E baseURL is required.");
    await page.context().addCookies([sessionCookie(actor, baseURL)]);
    await runTest(page);
  },
  otherUserPage: async ({ browser, otherActor, baseURL }, runTest, testInfo) => {
    if (!baseURL) throw new Error("Web E2E baseURL is required.");
    const page = await openActorPage(browser, otherActor, baseURL, testInfo);
    try {
      await runTest(page);
    } finally {
      await page.context().close();
    }
  },
  content: async ({ database, actor }, runTest) => {
    await runTest(await createContent(database, actor.id));
  },
  hiddenContent: async ({ database, actor }, runTest) => {
    await runTest(await createContent(database, actor.id, true));
  },
  otherUserContent: async ({ database, otherActor }, runTest) => {
    await runTest(await createContent(database, otherActor.id));
  },
});

export { expect };
