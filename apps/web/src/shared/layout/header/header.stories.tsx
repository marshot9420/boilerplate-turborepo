import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import Header from "./header";

const meta = {
  title: "Shared/Layout/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
