import type { Preview } from "@storybook/react-vite";

import "../src/styles/storybook.css";

import basePreview from "@repo/storybook-config/preview";

const preview = {
  ...basePreview,
  decorators: [
    (Story, context) => {
      const theme = context.parameters["dsTheme"] ?? "web";

      return (
        <div data-ds-theme={theme} className="min-h-screen bg-background p-6 text-foreground">
          <Story />
        </div>
      );
    },
  ],
} satisfies Preview;

export default preview;