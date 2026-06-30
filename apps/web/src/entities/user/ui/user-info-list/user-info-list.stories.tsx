import type { UserDetailResponse } from "@repo/domain/user/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import UserInfoList from "./user-info-list";

const activeUser = {
  id: "user-1",
  email: "mars@example.com",
  name: "MARS",
  avatarUrl: "https://example.com/avatar.png",
  nickname: "mars_user",
  role: "USER",
  status: "ACTIVE",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  lastLoginAt: "2026-01-03T00:00:00.000Z",
  deletedAt: null,
} satisfies UserDetailResponse;

const meta = {
  title: "Entities/User/UserInfoList",
  component: UserInfoList,
  args: {
    user: activeUser,
  },
} satisfies Meta<typeof UserInfoList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const EmptyOptionalValues = {
  args: {
    user: {
      ...activeUser,
      name: null,
      avatarUrl: null,
      lastLoginAt: null,
    },
  },
} satisfies Story;

export const Admin = {
  args: {
    user: {
      ...activeUser,
      role: "ADMIN",
      nickname: "admin_user",
    },
  },
} satisfies Story;

export const Suspended = {
  args: {
    user: {
      ...activeUser,
      status: "SUSPENDED",
    },
  },
} satisfies Story;
