import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import ContentPagination from "./content-pagination";

const meta = {
  title: "Entities/Content/ContentPagination",
  component: ContentPagination,
  parameters: {
    layout: "centered",
  },
  args: {
    meta: {
      page: 2,
      limit: 20,
      totalCount: 100,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: true,
    },
  },
} satisfies Meta<typeof ContentPagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FirstPage: Story = {
  args: {
    meta: {
      page: 1,
      limit: 20,
      totalCount: 100,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    },
  },
};

export const LastPage: Story = {
  args: {
    meta: {
      page: 5,
      limit: 20,
      totalCount: 100,
      totalPages: 5,
      hasNextPage: false,
      hasPreviousPage: true,
    },
  },
};

export const WithSearchParams: Story = {
  args: {
    meta: {
      page: 2,
      limit: 20,
      totalCount: 100,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: true,
    },
    searchParams: {
      status: "HIDDEN",
      limit: "20",
    },
  },
};
