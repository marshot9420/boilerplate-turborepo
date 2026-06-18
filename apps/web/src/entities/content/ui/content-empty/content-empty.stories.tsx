import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import ContentEmpty from "./content-empty";

const meta = {
  title: "Entities/Content/ContentEmpty",
  component: ContentEmpty,
} satisfies Meta<typeof ContentEmpty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
