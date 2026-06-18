import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import Shell from "./shell";

const meta = {
  title: "Shared/Layout/Shell",
  component: Shell,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Shell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: (
      <section className="flex min-h-[calc(100dvh-12rem)] flex-col items-start justify-center gap-6">
        <div className="max-w-2xl space-y-4">
          <p className="text-muted-foreground text-sm font-medium">Shell Preview</p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Web App Layout</h1>

          <p className="text-muted-foreground text-base leading-7 sm:text-lg">
            Header, Main, Footer가 조합된 web 앱 기본 레이아웃입니다.
          </p>
        </div>
      </section>
    ),
  },
} satisfies Story;
