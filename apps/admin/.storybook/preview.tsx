import { ToastProvider } from "@repo/design-system/toast";
import basePreview from "@repo/storybook-config/preview";

import "../src/app/globals.css";

const baseDecorators = Array.isArray(basePreview.decorators)
  ? basePreview.decorators
  : basePreview.decorators
    ? [basePreview.decorators]
    : [];

const preview: typeof basePreview = {
  ...basePreview,
  decorators: [
    ...baseDecorators,
    (Story) => (
      <>
        <Story />
        <ToastProvider />
      </>
    ),
  ],
};

export default preview;
