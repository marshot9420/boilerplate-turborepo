import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import Layout from "./layout";

const meta = {
  title: "Shared/Layout",
  component: Layout,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
} satisfies Meta<typeof Layout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      email: "admin@example.com",
      nickname: "관리자",
    },
    headerActions: <button type="button">로그아웃</button>,
    children: (
      <section className="rounded-lg border p-6">
        <h1 className="text-xl font-semibold">본문 영역</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          전역 레이아웃 내부에 페이지 콘텐츠가 들어갑니다.
        </p>
      </section>
    ),
  },
};

export const WithoutUser: Story = {
  args: {
    children: (
      <section className="rounded-lg border p-6">
        <h1 className="text-xl font-semibold">본문 영역</h1>
      </section>
    ),
  },
};
