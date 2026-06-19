import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import LogoutButton from "./logout-button";

const meta = {
  title: "Features/Auth/LogoutButton",
  component: LogoutButton,
  args: {
    label: "로그아웃",
  },
} satisfies Meta<typeof LogoutButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const GhostSmall = {
  args: {
    variant: "ghost",
    size: "sm",
  },
} satisfies Story;

export const Outline = {
  args: {
    variant: "outline",
  },
} satisfies Story;
