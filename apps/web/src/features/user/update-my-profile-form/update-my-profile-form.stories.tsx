import type { ActionResult } from "@repo/core/action";
import type { UserDetailResponse } from "@repo/domain/user/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import UpdateMyProfileForm from "./update-my-profile-form";
import type { UpdateMyProfileFormAction } from "./update-my-profile-form";

const user = {
  id: "user-1",
  email: "user@example.com",
  name: "USER",
  avatarUrl: "https://example.com/avatar.png",
  nickname: "user123",
  role: "USER",
  status: "ACTIVE",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  lastLoginAt: "2026-01-03T00:00:00.000Z",
  deletedAt: null,
} satisfies UserDetailResponse;

const mockAction: UpdateMyProfileFormAction = async (): Promise<
  ActionResult<UserDetailResponse>
> => {
  return {
    ok: true,
    data: user,
    message: "프로필이 수정되었습니다.",
  };
};

const meta = {
  title: "Features/User/UpdateMyProfileForm",
  component: UpdateMyProfileForm,
  args: {
    user,
    action: mockAction,
  },
  render: (args) => (
    <div className="bg-background max-w-3xl p-6">
      <UpdateMyProfileForm {...args} />
    </div>
  ),
} satisfies Meta<typeof UpdateMyProfileForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyOptionalFields: Story = {
  args: {
    user: {
      ...user,
      name: null,
      avatarUrl: null,
    },
  },
};

export const LongProfile: Story = {
  args: {
    user: {
      ...user,
      name: "홍길동",
      avatarUrl: null,
      nickname: "very_long_user_nickname_123",
    },
  },
};
