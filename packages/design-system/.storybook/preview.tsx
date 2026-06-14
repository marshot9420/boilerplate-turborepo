import type { Preview } from "@storybook/react-vite";

import basePreview from "@repo/storybook-config/preview";

import { ToastProvider } from "../src/toast";

import "../src/styles/storybook.css";

const baseDecorators = Array.isArray(basePreview.decorators)
  ? basePreview.decorators
  : basePreview.decorators
    ? [basePreview.decorators]
    : [];

const preview: Preview = {
  ...basePreview,
  decorators: [
    ...baseDecorators,
    (Story, context) => {
      const theme = context.parameters["dsTheme"] ?? "web";

      return (
        <div
          data-ds-theme={theme}
          className="min-h-screen bg-background p-6 text-foreground"
        >
          <Story />
          <ToastProvider />
        </div>
      );
    },
  ],
};

export default preview;
