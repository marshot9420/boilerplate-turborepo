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

    return {
      ...resolvedConfig,
      resolve: {
        ...resolvedConfig.resolve,
        alias: Array.isArray(existingAlias)
          ? [{ find: "@", replacement: srcPath }, ...existingAlias]
          : {
              ...existingAlias,
              "@": srcPath,
            },
      },
    };
  },
};

export default config;
