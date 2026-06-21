import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import UserRoleBadge from "./user-role-badge";

const meta = {
  title: "Entities/User/UserRoleBadge",
  component: UserRoleBadge,
  args: {
    role: "USER",
  },
  argTypes: {
    role: {
      control: "inline-radio",
      options: ["USER", "ADMIN"],
    },
  },
} satisfies Meta<typeof UserRoleBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const User: Story = {
  args: {
    role: "USER",
  },
};

export const Admin: Story = {
  args: {
    role: "ADMIN",
  },
};
