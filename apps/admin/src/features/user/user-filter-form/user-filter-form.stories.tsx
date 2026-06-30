import type { UserListQueryInput } from "@repo/domain/user/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import UserFilterForm from "./user-filter-form";

const filteredQuery = {
  keyword: "admin",
  role: "ADMIN",
  status: "ACTIVE",
  sortKey: "EMAIL",
  sortDirection: "asc",
  limit: 20,
} satisfies UserListQueryInput;

const meta = {
  title: "Features/User/UserFilterForm",
  component: UserFilterForm,
  args: {
    action: "/users",
    query: {},
  },
} satisfies Meta<typeof UserFilterForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithQuery: Story = {
  args: {
    query: filteredQuery,
  },
};

export const SuspendedUsers: Story = {
  args: {
    query: {
      status: "SUSPENDED",
    },
  },
};
