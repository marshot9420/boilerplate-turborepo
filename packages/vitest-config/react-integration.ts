import react from "@vitejs/plugin-react";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["@testing-library/jest-dom/vitest"],

    include: ["src/**/*.integration.test.ts", "src/**/*.integration.test.tsx"],

    testTimeout: 30_000,
    hookTimeout: 30_000,

    fileParallelism: false,

    coverage: {
      provider: "v8",

      reporter: ["text", "html"],

      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/*.d.ts",
        "**/*.config.*",
        "**/index.ts",
        "**/*.test.ts",
        "**/*.test.tsx",
      ],
    },
  },
});
