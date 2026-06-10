import globals from "globals";

import { baseConfig } from "./base.js";

/**
 * ESLint config for test files.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const testConfig = [
  ...baseConfig,

  {
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.integration.test.ts",
      "**/*.integration.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
    ],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.vitest,
      },
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default testConfig;
