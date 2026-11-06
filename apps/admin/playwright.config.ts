import { defineConfig } from "@playwright/test";

import { defineNextAppE2EConfig, loadPlaywrightEnv } from "@repo/playwright-config";

loadPlaywrightEnv();

const port = Number(process.env.ADMIN_E2E_PORT ?? 3101);

const baseURL = process.env.ADMIN_E2E_BASE_URL ?? `http://localhost:${port}`;

const webPort = Number(process.env.WEB_E2E_PORT ?? 3100);
const webBaseURL = process.env.WEB_E2E_BASE_URL ?? `http://localhost:${webPort}`;

const adminConfig = defineNextAppE2EConfig({
  baseURL,
  devCommand: `pnpm exec next dev --port ${port}`,
  ciCommand: `pnpm build && pnpm exec next start --port ${port}`,
});

const webConfig = defineNextAppE2EConfig({
  baseURL: webBaseURL,
  devCommand: `pnpm --filter web exec next dev --port ${webPort}`,
  ciCommand: `pnpm --filter web build && pnpm --filter web exec next start --port ${webPort}`,
});

export default defineConfig({
  ...adminConfig,

  webServer: [
    ...(Array.isArray(adminConfig.webServer) ? adminConfig.webServer : [adminConfig.webServer!]),
    ...(Array.isArray(webConfig.webServer) ? webConfig.webServer : [webConfig.webServer!]),
  ],

  globalSetup: "./e2e/auth.setup.ts",
});
