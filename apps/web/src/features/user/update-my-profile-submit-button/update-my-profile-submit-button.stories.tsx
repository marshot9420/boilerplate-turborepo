import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import UpdateMyProfileSubmitButton from "./update-my-profile-submit-button";

const meta = {
  title: "Features/User/UpdateMyProfileSubmitButton",
  component: UpdateMyProfileSubmitButton,
  args: {
    children: "프로필 수정",
  },
  render: (args) => (
    <form className="bg-background flex max-w-sm flex-col gap-4 rounded-xl border p-6">
      <UpdateMyProfileSubmitButton {...args} />
    </form>
  ),
} satisfies Meta<typeof UpdateMyProfileSubmitButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomText: Story = {
  args: {
    children: "저장하기",
    pendingText: "저장 중...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
