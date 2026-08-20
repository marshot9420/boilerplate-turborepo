import { fileURLToPath } from "node:url";

import nextjsConfig, { type StorybookConfig } from "@repo/storybook-config/nextjs";

const srcPath = fileURLToPath(new URL("../src", import.meta.url));

const config: StorybookConfig = {
  ...nextjsConfig,

  async viteFinal(viteConfig, options) {
    const resolvedConfig = nextjsConfig.viteFinal
      ? await nextjsConfig.viteFinal(viteConfig, options)
      : viteConfig;

    const existingAlias = resolvedConfig.resolve?.alias;

    const normalizedAlias = Array.isArray(existingAlias)
      ? existingAlias
      : Object.entries(existingAlias ?? {}).map(([find, replacement]) => ({
          find,
          replacement,
        }));

    const aliasesWithoutAppAlias = normalizedAlias.filter((alias) => alias.find !== "@");

    return {
      ...resolvedConfig,

      resolve: {
        ...resolvedConfig.resolve,
        alias: [
          ...aliasesWithoutAppAlias,
          {
            find: "@",
            replacement: srcPath,
          },
        ],
      },
    };
  },
};

export default config;
