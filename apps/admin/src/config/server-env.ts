import "server-only";

import { z } from "zod";

import { serverEnv as commonServerEnv, type ServerEnv as CommonServerEnv } from "@repo/env/server";

const httpUrl = z.url({
  protocol: /^https?$/,
  error: "ADMIN_APP_URL must be a valid HTTP URL",
});

const adminServerEnvSchema = z.object({
  ADMIN_APP_URL: httpUrl,
});

function normalizeAppUrl(value: string | undefined): string | undefined {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return undefined;
  }

  if (/^https?:\/\//i.test(normalizedValue)) {
    return normalizedValue;
  }

  return `https://${normalizedValue}`;
}

function resolveAdminAppUrl(): string | undefined {
  return (
    normalizeAppUrl(process.env.ADMIN_APP_URL) ??
    normalizeAppUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  );
}

const adminServerEnv = adminServerEnvSchema.parse({
  ADMIN_APP_URL: resolveAdminAppUrl(),
});

export type ServerEnv = CommonServerEnv & z.infer<typeof adminServerEnvSchema>;

export const serverEnv: ServerEnv = {
  ...commonServerEnv,
  ...adminServerEnv,
};
