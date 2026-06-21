import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",

    include: ["src/**/*.test.ts"],

    exclude: [
      ...coverageConfigDefaults.exclude,
      "src/**/*.integration.test.ts",
      "src/**/*.spec.ts",
    ],

    coverage: {
      provider: "v8",

      reporter: ["text", "html"],

      exclude: [...coverageConfigDefaults.exclude, "**/*.d.ts", "**/*.config.*", "**/index.ts"],
    },
  },
});
