import type { Meta, StoryObj } from "@storybook/react-vite";

import Popover, { PopoverClose, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  title: "Web/Overlay/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

const Trigger = ({ children }: { children: string }) => {
  return (
    <PopoverTrigger className="border-border bg-surface text-foreground rounded-md border px-4 py-2 text-sm font-medium">
      {children}
    </PopoverTrigger>
  );
};

export const Default = {
  render: () => {
    return (
      <Popover>
        <Trigger>도움말</Trigger>

        <PopoverContent>
          <div className="grid gap-3">
            <div>
              <p className="text-foreground text-sm font-medium">도움말</p>
              <p className="text-muted-foreground text-sm">
                사용자가 특정 기능의 맥락을 빠르게 이해할 수 있도록 보조 설명을 제공합니다.
              </p>
            </div>

            <PopoverClose className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-medium">
              확인
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex gap-3">
        {(["sm", "md", "lg"] as const).map((size) => {
          return (
            <Popover key={size}>
              <Trigger>{size}</Trigger>
              <PopoverContent size={size}>
                <p className="text-foreground text-sm">size={size}</p>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    );
  },
} satisfies Story;

export const FormLike = {
  render: () => {
    return (
      <Popover>
        <Trigger>프로필 공개</Trigger>

        <PopoverContent>
          <div className="grid gap-3">
            <label className="text-foreground grid gap-1.5 text-sm font-medium">
              공개 범위
              <select className="border-border bg-background rounded-md border px-3 py-2 text-sm">
                <option>공개</option>
                <option>비공개</option>
              </select>
            </label>

            <PopoverClose className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-medium">
              저장
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
} satisfies Story;
