import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import LogoutSubmitButton from "./logout-submit-button";

const meta = {
  title: "Features/Auth/LogoutSubmitButton",
  component: LogoutSubmitButton,
  render: (args) => (
    <form action="/api/auth/logout" method="post">
      <LogoutSubmitButton {...args} />
    </form>
  ),
  args: {
    label: "로그아웃",
    pendingLabel: "로그아웃 중",
  },
} satisfies Meta<typeof LogoutSubmitButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const CustomLabel = {
  args: {
    label: "나가기",
    pendingLabel: "처리 중",
  },
} satisfies Story;
