import type { PaginationMeta } from "@repo/core/pagination";
import type { UserListQueryInput } from "@repo/domain/user/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import UserListPagination from "./user-list-pagination";

function createMeta(overrides: Partial<PaginationMeta> = {}): PaginationMeta {
  return {
    page: 1,
    limit: 20,
    totalCount: 120,
    totalPages: 6,
    hasNextPage: true,
    hasPreviousPage: false,
    ...overrides,
  };
}

const filteredQuery = {
  keyword: "admin",
  role: "ADMIN",
  status: "ACTIVE",
  sortKey: "EMAIL",
  sortDirection: "asc",
  limit: 20,
} satisfies UserListQueryInput;

const meta = {
  title: "Entities/User/UserListPagination",
  component: UserListPagination,
  args: {
    action: "/users",
    query: {},
    meta: createMeta(),
  },
} satisfies Meta<typeof UserListPagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {};

export const MiddlePage: Story = {
  args: {
    meta: createMeta({
      page: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    }),
  },
};

export const LastPage: Story = {
  args: {
    meta: createMeta({
      page: 6,
      hasNextPage: false,
      hasPreviousPage: true,
    }),
  },
};

export const WithFilters: Story = {
  args: {
    query: filteredQuery,
    meta: createMeta({
      page: 2,
      hasNextPage: true,
      hasPreviousPage: true,
    }),
  },
};
