import type { StorybookConfig } from "@storybook/nextjs-vite";

export type { Meta, StorybookConfig, StoryObj } from "@storybook/nextjs-vite";

export const nextJsStorybookConfig: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
};

export default nextJsStorybookConfig;
