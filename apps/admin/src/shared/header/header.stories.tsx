import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import Header from "./header";

const meta = {
  title: "Shared/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: <button type="button">로그아웃</button>,
  },
};
