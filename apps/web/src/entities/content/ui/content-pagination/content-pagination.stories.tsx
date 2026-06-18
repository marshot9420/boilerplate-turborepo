import type { ContentListResponse } from "@repo/domain/content/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import ContentPagination from "./content-pagination";

const firstPageMeta = {
  page: 1,
  limit: 20,
  totalCount: 120,
  totalPages: 6,
  hasNextPage: true,
  hasPreviousPage: false,
} satisfies ContentListResponse["meta"];

const meta = {
  title: "Entities/Content/ContentPagination",
  component: ContentPagination,
  args: {
    meta: firstPageMeta,
  },
} satisfies Meta<typeof ContentPagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FirstPage = {} satisfies Story;

export const MiddlePage = {
  args: {
    meta: {
      page: 3,
      limit: 20,
      totalCount: 120,
      totalPages: 6,
      hasNextPage: true,
      hasPreviousPage: true,
    },
  },
} satisfies Story;

export const LastPage = {
  args: {
    meta: {
      page: 6,
      limit: 20,
      totalCount: 120,
      totalPages: 6,
      hasNextPage: false,
      hasPreviousPage: true,
    },
  },
} satisfies Story;

export const ManyPages = {
  args: {
    meta: {
      page: 10,
      limit: 20,
      totalCount: 600,
      totalPages: 30,
      hasNextPage: true,
      hasPreviousPage: true,
    },
  },
} satisfies Story;

export const CustomLimit = {
  args: {
    meta: {
      page: 2,
      limit: 10,
      totalCount: 60,
      totalPages: 6,
      hasNextPage: true,
      hasPreviousPage: true,
    },
  },
} satisfies Story;

export const SinglePage = {
  args: {
    meta: {
      page: 1,
      limit: 20,
      totalCount: 3,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
} satisfies Story;
