import type { StorybookConfig } from "@storybook/react-vite";

import baseConfig from "@repo/storybook-config/react";

const config = {
  ...baseConfig,
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
} satisfies StorybookConfig;

export default config;
