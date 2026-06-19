import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import HeaderView from "./header-view";

const meta = {
  title: "Shared/Layout/Header",
  component: HeaderView,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    isAuthenticated: false,
  },
} satisfies Meta<typeof HeaderView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guest = {
  args: {
    isAuthenticated: false,
  },
} satisfies Story;

export const Authenticated = {
  args: {
    isAuthenticated: true,
  },
} satisfies Story;
