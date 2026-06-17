import type { Meta, StoryObj } from "@storybook/react-vite";

import Popover, { PopoverClose, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  title: "Admin/Overlay/Popover",
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
        <Trigger>필터</Trigger>

        <PopoverContent>
          <div className="grid gap-3">
            <div>
              <p className="text-foreground text-sm font-medium">관리자 필터</p>
              <p className="text-muted-foreground text-sm">
                콘텐츠 상태나 사용자 권한을 빠르게 필터링할 수 있습니다.
              </p>
            </div>

            <PopoverClose className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-medium">
              적용
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
        <Trigger>상태 변경</Trigger>

        <PopoverContent>
          <div className="grid gap-3">
            <label className="text-foreground grid gap-1.5 text-sm font-medium">
              상태
              <select className="border-border bg-background rounded-md border px-3 py-2 text-sm">
                <option>게시</option>
                <option>숨김</option>
                <option>삭제</option>
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
