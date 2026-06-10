import type { StorybookConfig } from "@storybook/nextjs-vite";

export const nextJsStorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
} satisfies StorybookConfig;

export default nextJsStorybookConfig;
