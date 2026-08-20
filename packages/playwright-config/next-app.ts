import { devices, type PlaywrightTestConfig } from "@playwright/test";

export interface NextAppE2EConfigOptions {
  baseURL: string;
  devCommand: string;
  ciCommand: string;
  testDir?: string;
}

export function defineNextAppE2EConfig({
  baseURL,
  devCommand,
  ciCommand,
  testDir = "./e2e",
}: NextAppE2EConfigOptions): PlaywrightTestConfig {
  const isCI = process.env.CI === "true" || process.env.CI === "1";

  const command = isCI ? ciCommand : devCommand;

  return {
    testDir,

    fullyParallel: true,

    forbidOnly: isCI,

    retries: isCI ? 2 : 0,

    workers: isCI ? 1 : undefined,

    reporter: isCI
      ? [["github"], ["html", { open: "never" }]]
      : [["list"], ["html", { open: "never" }]],

    use: {
      baseURL,

      trace: "on-first-retry",

      screenshot: "only-on-failure",

      video: "retain-on-failure",
    },

    webServer: {
      command,
      url: baseURL,

      reuseExistingServer: !isCI,

      timeout: 120_000,

      stdout: "ignore",
      stderr: "pipe",
    },

    projects: [
      {
        name: "chromium",

        use: {
          ...devices["Desktop Chrome"],
        },
      },
      {
        name: "mobile-chrome",

        use: {
          ...devices["Pixel 5"],
        },
      },
    ],

    outputDir: "test-results",
  };
}
