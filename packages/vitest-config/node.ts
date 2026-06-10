import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",

    include: ["src/**/*.test.ts", "src/**/*.integration.test.ts"],

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
