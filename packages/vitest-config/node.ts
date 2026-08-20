import { fileURLToPath } from "node:url";

import { coverageConfigDefaults, defineConfig } from "vitest/config";

const loadTestEnvPath = fileURLToPath(new URL("./setup/load-test-env.ts", import.meta.url));

const serverOnlyPath = fileURLToPath(new URL("./setup/server-only.ts", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "server-only": serverOnlyPath,
    },
  },

  test: {
    globals: true,
    environment: "node",

    setupFiles: [loadTestEnvPath],
    include: ["src/**/*.test.ts"],
    exclude: [
      ...coverageConfigDefaults.exclude,
      "src/**/*.integration.test.ts",
      "src/**/*.spec.ts",
    ],

    passWithNoTests: true,

    coverage: {
      provider: "v8",

      reporter: ["text", "html"],

      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/*.d.ts",
        "**/*.config.*",
        "**/index.ts",
        "**/*.integration.test.ts",
      ],
    },
  },
});
