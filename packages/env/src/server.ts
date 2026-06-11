import "server-only";

import { z } from "zod";

import { sharedEnvSchema } from "./shared";

const httpUrl = z.url({
  protocol: /^https?$/,
  error: "Must be a valid HTTP URL",
});

export const serverEnvSchema = sharedEnvSchema.extend({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),

  WEB_APP_URL: httpUrl,
  ADMIN_APP_URL: httpUrl,

  AUTH_SESSION_COOKIE_NAME: z
    .string()
    .min(1, "AUTH_SESSION_COOKIE_NAME is required"),
  AUTH_SESSION_MAX_AGE_SECONDS: z.coerce
    .number()
    .int()
    .positive("AUTH_SESSION_MAX_AGE_SECONDS must be a positive integer"),

  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  NAVER_CLIENT_ID: z.string().min(1, "NAVER_CLIENT_ID is required"),
  NAVER_CLIENT_SECRET: z.string().min(1, "NAVER_CLIENT_SECRET is required"),

  KAKAO_CLIENT_ID: z.string().min(1, "KAKAO_CLIENT_ID is required"),
  KAKAO_CLIENT_SECRET: z.string().min(1, "KAKAO_CLIENT_SECRET is required"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv = serverEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,

  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,

  WEB_APP_URL: process.env.WEB_APP_URL,
  ADMIN_APP_URL: process.env.ADMIN_APP_URL,

  AUTH_SESSION_COOKIE_NAME: process.env.AUTH_SESSION_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE_SECONDS: process.env.AUTH_SESSION_MAX_AGE_SECONDS,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,

  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET,
});
