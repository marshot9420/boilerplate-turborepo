import type { Preview } from "@storybook/nextjs-vite";

const preview = {
  parameters: {
    controls: {
      expanded: true,
    },
    a11y: {
      test: "todo",
    },
  },
} satisfies Preview;

export default preview;
