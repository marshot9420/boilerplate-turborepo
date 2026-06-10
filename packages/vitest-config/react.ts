import react from "@vitejs/plugin-react";
import { mergeConfig } from "vitest/config";

import { baseConfig } from "./base";

export default mergeConfig(baseConfig, {
  plugins: [react()],

  test: {
    environment: "jsdom",
    setupFiles: ["@testing-library/jest-dom/vitest"],

    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "src/**/*.integration.test.ts",
      "src/**/*.integration.test.tsx",
    ],
  },
});
