import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import ContentFilterForm from "./content-filter-form";

const meta = {
  title: "Features/Content/ContentFilterForm",
  component: ContentFilterForm,
  parameters: {
    layout: "padded",
  },
  args: {
    defaultValues: undefined,
  },
} satisfies Meta<typeof ContentFilterForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filtered: Story = {
  args: {
    defaultValues: {
      status: "HIDDEN",
      authorId: "00000000-0000-4000-8000-000000000001",
      limit: "50",
    },
  },
};

export const DeletedContents: Story = {
  args: {
    defaultValues: {
      status: "DELETED",
      limit: "100",
    },
  },
};
