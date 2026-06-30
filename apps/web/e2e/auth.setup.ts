import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { loadPlaywrightEnv } from "@repo/playwright-config";

loadPlaywrightEnv();

const E2E_USER_EMAIL = "e2e-user@example.com";
const E2E_USER_SESSION_ID = "00000000-0000-4000-8000-000000900201";
const E2E_USER_SESSION_TOKEN = "e2e-web-user-session-token";
const STORAGE_STATE_PATH = path.resolve(process.cwd(), "e2e/.auth/user.json");

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function getRequiredEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
}

function createSessionCookie(params: {
  baseURL: string;
  cookieName: string;
  expiresAt: Date;
  token: string;
}) {
  const url = new URL(params.baseURL);

  return {
    name: params.cookieName,
    value: params.token,
    domain: url.hostname,
    path: "/",
    expires: Math.floor(params.expiresAt.getTime() / 1000),
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "Lax" as const,
  };
}

export default async function globalSetup() {
  const baseURL = process.env.WEB_E2E_BASE_URL ?? "http://localhost:3100";
  const cookieName = getRequiredEnv("AUTH_SESSION_COOKIE_NAME");
  const expiresAt = addDays(new Date(), 30);

  const { disconnectScriptPrisma, scriptPrisma } = await import("@repo/database/script-client");

  try {
    const user = await scriptPrisma.user.findUnique({
      where: {
        email: E2E_USER_EMAIL,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error(`E2E user not found: ${E2E_USER_EMAIL}. Run pnpm db:e2e:seed first.`);
    }

    await scriptPrisma.userSession.upsert({
      where: {
        id: E2E_USER_SESSION_ID,
      },
      create: {
        id: E2E_USER_SESSION_ID,
        tokenHash: hashToken(E2E_USER_SESSION_TOKEN),
        expiresAt,
        revokedAt: null,
        ipAddress: "127.0.0.1",
        userAgent: "Playwright E2E Web User",
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      update: {
        tokenHash: hashToken(E2E_USER_SESSION_TOKEN),
        expiresAt,
        revokedAt: null,
        ipAddress: "127.0.0.1",
        userAgent: "Playwright E2E Web User",
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    await mkdir(path.dirname(STORAGE_STATE_PATH), {
      recursive: true,
    });

    await writeFile(
      STORAGE_STATE_PATH,
      JSON.stringify(
        {
          cookies: [
            createSessionCookie({
              baseURL,
              cookieName,
              expiresAt,
              token: E2E_USER_SESSION_TOKEN,
            }),
          ],
          origins: [],
        },
        null,
        2,
      ),
    );
  } finally {
    await disconnectScriptPrisma();
  }
}
