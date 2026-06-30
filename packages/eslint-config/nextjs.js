import { globalIgnores } from "eslint/config";

import pluginNext from "@next/eslint-plugin-next";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

import { baseConfig } from "./base.js";

/**
 * ESLint config for Next.js apps.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nextJsConfig = [
  ...baseConfig,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  {
    ...pluginReact.configs.flat.recommended,

    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,

      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },

  {
    files: [
      "next.config.js",
      "next.config.mjs",
      "next.config.ts",
      "postcss.config.js",
      "postcss.config.mjs",
      "tailwind.config.js",
      "tailwind.config.ts",
      "vitest.config.ts",
      "vitest.integration.config.ts",
      "eslint.config.js",
    ],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    plugins: {
      "@next/next": pluginNext,
    },

    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },

  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },

    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
];

export default nextJsConfig;
