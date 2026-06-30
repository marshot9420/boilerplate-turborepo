import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import UserStatusBadge from "./user-status-badge";

const meta = {
  title: "Entities/User/UserStatusBadge",
  component: UserStatusBadge,
  args: {
    status: "ACTIVE",
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["ACTIVE", "SUSPENDED", "BANNED", "DELETED"],
    },
  },
} satisfies Meta<typeof UserStatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    status: "ACTIVE",
  },
};

export const Suspended: Story = {
  args: {
    status: "SUSPENDED",
  },
};

export const Banned: Story = {
  args: {
    status: "BANNED",
  },
};

export const Deleted: Story = {
  args: {
    status: "DELETED",
  },
};
