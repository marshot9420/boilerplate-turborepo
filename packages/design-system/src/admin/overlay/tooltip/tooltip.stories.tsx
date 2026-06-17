import type { Meta, StoryObj } from "@storybook/react-vite";

import Tooltip, { TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const meta = {
  title: "Admin/Overlay/Tooltip",
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
          <Trigger>권한 정보</Trigger>

          <TooltipContent>관리자 권한에 따라 사용할 수 있는 기능이 달라집니다.</TooltipContent>
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
          <Trigger>상태 정보</Trigger>

          <TooltipContent>
            게시 상태는 사용자에게 콘텐츠가 노출되는지 결정합니다.
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
