import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { loadPlaywrightEnv } from "@repo/playwright-config";

loadPlaywrightEnv();

const E2E_ADMIN_EMAIL = "e2e-admin@example.com";

const E2E_ADMIN_SESSION_ID = "00000000-0000-4000-8000-000000900202";

const E2E_ADMIN_SESSION_TOKEN = "e2e-admin-session-token";

const STORAGE_STATE_PATH = path.resolve(process.cwd(), "e2e/.auth/admin.json");

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);

  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function requiredEnv(key: string): string {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
}

function buildSessionCookie(params: {
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
  const port = Number(process.env.ADMIN_E2E_PORT ?? 3101);

  const baseURL = process.env.ADMIN_E2E_BASE_URL ?? `http://localhost:${port}`;

  const cookieName = requiredEnv("AUTH_SESSION_COOKIE_NAME");

  const expiresAt = addDays(new Date(), 30);

  const { disconnectScriptPrisma, scriptPrisma } = await import("@repo/database/script-client");

  try {
    const admin = await scriptPrisma.user.findUnique({
      where: {
        email: E2E_ADMIN_EMAIL,
      },

      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (!admin) {
      throw new Error(`E2E admin not found: ${E2E_ADMIN_EMAIL}. Run pnpm db:e2e:seed first.`);
    }

    if (admin.role !== "ADMIN") {
      throw new Error(`E2E admin must have ADMIN role: ${E2E_ADMIN_EMAIL}`);
    }

    if (admin.status !== "ACTIVE") {
      throw new Error(`E2E admin must be ACTIVE: ${E2E_ADMIN_EMAIL}`);
    }

    await scriptPrisma.userSession.upsert({
      where: {
        id: E2E_ADMIN_SESSION_ID,
      },

      create: {
        id: E2E_ADMIN_SESSION_ID,

        tokenHash: hashToken(E2E_ADMIN_SESSION_TOKEN),

        expiresAt,
        revokedAt: null,

        ipAddress: "127.0.0.1",

        userAgent: "Playwright E2E Admin",

        user: {
          connect: {
            id: admin.id,
          },
        },
      },

      update: {
        tokenHash: hashToken(E2E_ADMIN_SESSION_TOKEN),

        expiresAt,
        revokedAt: null,

        ipAddress: "127.0.0.1",

        userAgent: "Playwright E2E Admin",

        user: {
          connect: {
            id: admin.id,
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
            buildSessionCookie({
              baseURL,
              cookieName,
              expiresAt,
              token: E2E_ADMIN_SESSION_TOKEN,
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
