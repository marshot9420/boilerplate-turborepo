import type { UserListItemResponse } from "@repo/domain/user/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import UserTable from "./user-table";

function createMockUser(overrides: Partial<UserListItemResponse> = {}): UserListItemResponse {
  return {
    id: "user-id",
    email: "user@example.com",
    name: "홍길동",
    avatarUrl: null,
    nickname: "gildong",
    role: "USER",
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
    lastLoginAt: "2026-01-02T03:30:00.000Z",
    ...overrides,
  };
}

const users = [
  createMockUser({
    id: "admin-id",
    email: "admin@example.com",
    name: "관리자",
    nickname: "admin",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
    lastLoginAt: "2026-01-05T12:30:00.000Z",
  }),
  createMockUser({
    id: "active-user-id",
    email: "active@example.com",
    name: "활성 사용자",
    nickname: "active_user",
    role: "USER",
    status: "ACTIVE",
    createdAt: "2026-01-02T00:00:00.000Z",
    lastLoginAt: "2026-01-06T08:10:00.000Z",
  }),
  createMockUser({
    id: "suspended-user-id",
    email: "suspended@example.com",
    name: "정지 사용자",
    nickname: "suspended_user",
    role: "USER",
    status: "SUSPENDED",
    createdAt: "2026-01-03T00:00:00.000Z",
    lastLoginAt: null,
  }),
  createMockUser({
    id: "banned-user-id",
    email: "banned@example.com",
    name: "차단 사용자",
    nickname: "banned_user",
    role: "USER",
    status: "BANNED",
    createdAt: "2026-01-04T00:00:00.000Z",
    lastLoginAt: null,
  }),
  createMockUser({
    id: "deleted-user-id",
    email: "deleted@example.com",
    name: null,
    nickname: "deleted_user",
    role: "USER",
    status: "DELETED",
    createdAt: "2026-01-05T00:00:00.000Z",
    lastLoginAt: null,
  }),
] satisfies UserListItemResponse[];

const meta = {
  title: "Entities/User/UserTable",
  component: UserTable,
  args: {
    users,
  },
  parameters: {
    controls: {
      exclude: ["getUserHref"],
    },
  },
} satisfies Meta<typeof UserTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDetailLinks: Story = {
  render: (args) => <UserTable {...args} getUserHref={(userId) => `/users/${userId}`} />,
};

export const WithoutNames: Story = {
  args: {
    users: [
      createMockUser({
        id: "nickname-only-id",
        email: "nickname-only@example.com",
        name: null,
        nickname: "nickname_only",
      }),
    ],
  },
};

export const EmptyRows: Story = {
  args: {
    users: [],
  },
};
