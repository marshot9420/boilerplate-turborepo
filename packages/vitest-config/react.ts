import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

const loadTestEnvPath = fileURLToPath(new URL("./setup/load-test-env.ts", import.meta.url));

const serverOnlyPath = fileURLToPath(new URL("./setup/server-only.ts", import.meta.url));

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "server-only": serverOnlyPath,
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [loadTestEnvPath, "@testing-library/jest-dom/vitest"],

    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],

    exclude: [
      ...coverageConfigDefaults.exclude,
      "src/**/*.integration.test.ts",
      "src/**/*.integration.test.tsx",
      "src/**/*.spec.ts",
      "src/**/*.spec.tsx",
    ],

    coverage: {
      provider: "v8",

      reporter: ["text", "html"],

      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/*.d.ts",
        "**/*.config.*",
        "**/index.ts",
        "**/*.integration.test.ts",
        "**/*.integration.test.tsx",
      ],
    },
  },
});
