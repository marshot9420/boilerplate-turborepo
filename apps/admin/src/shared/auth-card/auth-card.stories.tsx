import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import AuthCard from "./auth-card";

const meta = {
  title: "Shared/AuthCard",
  component: AuthCard,
} satisfies Meta<typeof AuthCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "관리자 로그인",
    description: "관리자 권한이 있는 계정으로 로그인해 주세요.",
    children: <div className="text-muted-foreground text-center text-sm">로그인 영역</div>,
    footer: (
      <p className="text-muted-foreground text-center text-xs">
        권한이 없는 계정은 접근할 수 없습니다.
      </p>
    ),
  },
};
