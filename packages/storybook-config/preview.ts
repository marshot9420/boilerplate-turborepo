import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
