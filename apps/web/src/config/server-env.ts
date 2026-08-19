import "server-only";

import { z } from "zod";

import { serverEnv as commonServerEnv, type ServerEnv as CommonServerEnv } from "@repo/env/server";

const httpUrl = z.url({
  protocol: /^https?$/,
  error: "WEB_APP_URL must be a valid HTTP URL",
});

const webServerEnvSchema = z.object({
  WEB_APP_URL: httpUrl,
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

function resolveWebAppUrl(): string | undefined {
  return (
    normalizeAppUrl(process.env.WEB_APP_URL) ??
    normalizeAppUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  );
}

const webServerEnv = webServerEnvSchema.parse({
  WEB_APP_URL: resolveWebAppUrl(),
});

export type ServerEnv = CommonServerEnv & z.infer<typeof webServerEnvSchema>;

export const serverEnv: ServerEnv = {
  ...commonServerEnv,
  ...webServerEnv,
};
