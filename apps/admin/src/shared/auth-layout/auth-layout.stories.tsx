import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import AuthLayout from "./auth-layout";

const meta = {
  title: "Shared/AuthLayout",
  component: AuthLayout,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AuthLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="bg-surface border-border rounded-md border p-6 text-center">
        인증 화면 콘텐츠
      </div>
    ),
  },
};
