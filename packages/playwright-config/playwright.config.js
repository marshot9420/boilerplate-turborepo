const { defineConfig, devices } = require("@playwright/test");

module.exports = ({ basePath, port }) => {
  const baseURL = `http://localhost:${port}${basePath}`;

  /** @type {import('@playwright/test').PlaywrightTestConfig} */
  const config = {
    testMatch: "**/*.e2e.{ts,tsx}",
    testDir: "e2e",
    outputDir: "e2e-results",
    retries: 2,

    reporter: [
      ["list"],
      ["html", { open: "never", outputFolder: "e2e-report" }],
    ],

    use: {
      baseURL,
      screenshot: "on",
      video: "on-first-retry",
      trace: "on-first-retry",
    },

    webServer: {
      command: "pnpm dev",
      url: baseURL,
      reuseExistingServer: !process.env.CI,
    },

    projects: [
      { name: "Desktop Chrome", use: devices["Desktop Chrome"] },
      { name: "Desktop Firefox", use: devices["Desktop Firefox"] },
      { name: "Desktop Safari", use: devices["Desktop Safari"] },
      { name: "Mobile Chrome", use: devices["Pixel 5"] },
      { name: "Mobile Safari", use: devices["iPhone 12"] },
    ],
  };

  return defineConfig(config);
};
