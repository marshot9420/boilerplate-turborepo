import "server-only";

import { z } from "zod";

import { sharedEnvSchema } from "./shared";

const httpUrl = z.url({
  protocol: /^https?$/,
  error: "Must be a valid HTTP URL",
});

const optionalNonEmptyString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const mailProviderSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.enum(["console", "resend"]).default("console"),
);

export const serverEnvSchema = sharedEnvSchema
  .extend({
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),

    WEB_APP_URL: httpUrl,
    ADMIN_APP_URL: httpUrl,

    E2E_AUTH_SECRET: z
      .string()
      .min(32, "E2E_AUTH_SECRET must be at least 32 characters")
      .optional(),

    AUTH_SESSION_COOKIE_NAME: z.string().min(1, "AUTH_SESSION_COOKIE_NAME is required"),
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

    MAIL_PROVIDER: mailProviderSchema,
    MAIL_FROM: optionalNonEmptyString,
    RESEND_API_KEY: optionalNonEmptyString,
  })
  .superRefine((env, context) => {
    if (env.MAIL_PROVIDER !== "resend") {
      return;
    }

    if (!env.MAIL_FROM) {
      context.addIssue({
        code: "custom",
        path: ["MAIL_FROM"],
        message: "MAIL_FROM is required when MAIL_PROVIDER is resend",
      });
    }

    if (!env.RESEND_API_KEY) {
      context.addIssue({
        code: "custom",
        path: ["RESEND_API_KEY"],
        message: "RESEND_API_KEY is required when MAIL_PROVIDER is resend",
      });
    }
  });

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv = serverEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,

  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,

  WEB_APP_URL: process.env.WEB_APP_URL,
  ADMIN_APP_URL: process.env.ADMIN_APP_URL,

  E2E_AUTH_SECRET: process.env.E2E_AUTH_SECRET,

  AUTH_SESSION_COOKIE_NAME: process.env.AUTH_SESSION_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE_SECONDS: process.env.AUTH_SESSION_MAX_AGE_SECONDS,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,

  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET,

  MAIL_PROVIDER: process.env.MAIL_PROVIDER,
  MAIL_FROM: process.env.MAIL_FROM,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
});
