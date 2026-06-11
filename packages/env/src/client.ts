import { z } from "zod";

import { sharedEnvSchema } from "./shared";

export const clientEnvSchema = sharedEnvSchema.extend({
  NEXT_PUBLIC_APP_URL: z.url({
    protocol: /^https?$/,
    error: "NEXT_PUBLIC_APP_URL must be a valid HTTP URL",
  }),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export const clientEnv = clientEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
