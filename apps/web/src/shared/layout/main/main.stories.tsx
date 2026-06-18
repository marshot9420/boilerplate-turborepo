import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import Main from "./main";

const meta = {
  title: "Shared/Layout/Main",
  component: Main,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Main>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: (
      <section className="space-y-4">
        <p className="text-muted-foreground text-sm font-medium">Main Area</p>

        <h1 className="text-3xl font-bold tracking-tight">페이지 콘텐츠</h1>

        <p className="text-muted-foreground text-base leading-7">
          이 영역은 각 페이지와 view 컴포넌트가 렌더링되는 기본 본문 영역입니다.
        </p>
      </section>
    ),
  },
} satisfies Story;
