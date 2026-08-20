import type { Meta, StoryObj } from "@repo/storybook-config/react";

import Tooltip, { TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const meta = {
  title: "Web/Overlay/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

const Trigger = ({ children }: { children: string }) => {
  return (
    <TooltipTrigger className="border-border bg-surface text-foreground rounded-md border px-4 py-2 text-sm font-medium">
      {children}
    </TooltipTrigger>
  );
};

export const Default = {
  render: () => {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <Trigger>도움말</Trigger>

          <TooltipContent>
            사용자가 특정 기능의 의미를 빠르게 이해할 수 있도록 도와줍니다.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
} satisfies Story;

export const WithArrow = {
  render: () => {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <Trigger>프로필 공개</Trigger>

          <TooltipContent>
            공개 설정을 켜면 다른 사용자가 프로필을 볼 수 있습니다.
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <TooltipProvider delayDuration={0}>
        <div className="flex gap-3">
          {(["sm", "md", "lg"] as const).map((size) => {
            return (
              <Tooltip key={size}>
                <Trigger>{size}</Trigger>

                <TooltipContent size={size}>size={size} tooltip content</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    );
  },
} satisfies Story;
