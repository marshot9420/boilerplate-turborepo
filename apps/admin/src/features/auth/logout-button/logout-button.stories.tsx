import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import LogoutButton from "./logout-button";

const meta = {
  title: "Features/Auth/LogoutButton",
  component: LogoutButton,
} satisfies Meta<typeof LogoutButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: {
    children: "관리자 로그아웃",
  },
};
