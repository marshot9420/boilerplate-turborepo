import { fileURLToPath } from "node:url";

import { mergeConfig } from "vitest/config";

import reactIntegrationConfig from "@repo/vitest-config/react-integration";

export default mergeConfig(reactIntegrationConfig, {
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  test: {
    setupFiles: ["./vitest.setup.ts"],
  },
});
