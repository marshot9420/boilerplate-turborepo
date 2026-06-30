import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import LoginErrorAlert from "./login-error-alert";

const meta = {
  title: "Shared/LoginErrorAlert",
  component: LoginErrorAlert,
} satisfies Meta<typeof LoginErrorAlert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Forbidden: Story = {
  args: {
    error: "forbidden",
  },
};

export const UnknownError: Story = {
  args: {
    error: "unknown_error",
  },
};
