import type { StorybookConfig } from "@storybook/react-vite";

export const reactStorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
} satisfies StorybookConfig;

export default reactStorybookConfig;
