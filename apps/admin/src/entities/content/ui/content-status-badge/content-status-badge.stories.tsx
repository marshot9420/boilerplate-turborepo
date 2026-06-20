import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import ContentStatusBadge from "./content-status-badge";

const meta = {
  title: "Entities/Content/ContentStatusBadge",
  component: ContentStatusBadge,
  parameters: {
    layout: "centered",
  },
  args: {
    status: "PUBLISHED",
  },
} satisfies Meta<typeof ContentStatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Published: Story = {
  args: {
    status: "PUBLISHED",
  },
};

export const Hidden: Story = {
  args: {
    status: "HIDDEN",
  },
};

export const Deleted: Story = {
  args: {
    status: "DELETED",
  },
};
