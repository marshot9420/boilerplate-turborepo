import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import Main from "./main";

const meta = {
  title: "Shared/Main",
  component: Main,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Main>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="rounded-lg border p-6">
        <h1 className="text-xl font-semibold">본문 영역</h1>
        <p className="text-muted-foreground mt-2 text-sm">페이지 콘텐츠가 렌더링되는 영역입니다.</p>
      </div>
    ),
  },
};
