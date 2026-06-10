import { mergeConfig } from "vitest/config";

import { baseConfig } from "./base";

export default mergeConfig(baseConfig, {
  test: {
    environment: "node",

    include: ["src/**/*.test.ts", "src/**/*.integration.test.ts"],
  },
});
