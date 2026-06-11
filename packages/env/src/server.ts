import "server-only";

import { z } from "zod";

import { sharedEnvSchema } from "./shared";

export const serverEnvSchema = sharedEnvSchema.extend({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv = serverEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
});
