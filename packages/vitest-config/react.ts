import react from "@vitejs/plugin-react";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["@testing-library/jest-dom/vitest"],

    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "src/**/*.integration.test.ts",
      "src/**/*.integration.test.tsx",
    ],

    coverage: {
      provider: "v8",

      reporter: ["text", "html"],

      exclude: [
        ...coverageConfigDefaults.exclude,

        "**/*.d.ts",
        "**/*.config.*",
        "**/index.ts",
      ],
    },
  },
});
