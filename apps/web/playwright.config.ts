import { defineConfig } from "@playwright/test";

import { createNextAppE2EConfig, loadPlaywrightEnv } from "@repo/playwright-config";

loadPlaywrightEnv();

const port = Number(process.env.WEB_E2E_PORT ?? 3100);
const baseURL = process.env.WEB_E2E_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  ...createNextAppE2EConfig({
    baseURL,
    devCommand: `pnpm exec next dev --port ${port}`,
    ciCommand: `pnpm build && pnpm exec next start --port ${port}`,
  }),

  globalSetup: "./e2e/auth.setup.ts",
});
