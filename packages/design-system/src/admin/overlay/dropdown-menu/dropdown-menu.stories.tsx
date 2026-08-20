import type { Meta, StoryObj } from "@repo/storybook-config/react";

import DropdownMenu, {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = {
  title: "Admin/Overlay/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

const Trigger = ({ children }: { children: string }) => {
  return (
    <DropdownMenuTrigger className="border-border bg-surface text-foreground rounded-md border px-4 py-2 text-sm font-medium">
      {children}
    </DropdownMenuTrigger>
  );
};

export const Default = {
  render: () => {
    return (
      <DropdownMenu>
        <Trigger>관리 메뉴</Trigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>관리</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>대시보드</DropdownMenuItem>
          <DropdownMenuItem>수정</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">삭제</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex gap-3">
        {(["sm", "md", "lg"] as const).map((size) => {
          return (
            <DropdownMenu key={size}>
              <Trigger>{size}</Trigger>
              <DropdownMenuContent size={size}>
                <DropdownMenuItem>메뉴 1</DropdownMenuItem>
                <DropdownMenuItem>메뉴 2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>
    );
  },
} satisfies Story;

export const CheckboxItems = {
  render: () => {
    return (
      <DropdownMenu>
        <Trigger>표시 옵션</Trigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>컬럼</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>이름</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>이메일</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>상태</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
} satisfies Story;

export const RadioItems = {
  render: () => {
    return (
      <DropdownMenu>
        <Trigger>상태 선택</Trigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>콘텐츠 상태</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="published">
            <DropdownMenuRadioItem value="published">게시</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="hidden">숨김</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="deleted">삭제</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
} satisfies Story;
