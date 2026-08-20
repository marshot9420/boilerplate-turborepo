import type { z } from "zod";

import { sharedEnvSchema } from "./shared";

export const clientEnvSchema = sharedEnvSchema;

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export const clientEnv = clientEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
});
