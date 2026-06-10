import globals from "globals";

import { baseConfig } from "./base.js";

/**
 * ESLint config for Node.js packages.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nodeConfig = [
  ...baseConfig,

  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];

export default nodeConfig;
