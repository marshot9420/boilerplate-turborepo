import { z } from "zod";

export const NodeEnvSchema = z.enum(["development", "test", "production"]);

export type NodeEnv = z.infer<typeof NodeEnvSchema>;

export const sharedEnvSchema = z.object({
  NODE_ENV: NodeEnvSchema.default("development"),
});

export type SharedEnv = z.infer<typeof sharedEnvSchema>;
