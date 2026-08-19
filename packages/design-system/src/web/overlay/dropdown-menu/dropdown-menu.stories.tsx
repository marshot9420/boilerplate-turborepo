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
  title: "Web/Overlay/DropdownMenu",
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
        <Trigger>계정 메뉴</Trigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>계정</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>내 정보</DropdownMenuItem>
          <DropdownMenuItem>설정</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">로그아웃</DropdownMenuItem>
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
        <Trigger>알림 설정</Trigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>알림</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>이메일</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>푸시</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>마케팅</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
} satisfies Story;

export const RadioItems = {
  render: () => {
    return (
      <DropdownMenu>
        <Trigger>공개 범위</Trigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>프로필 공개 범위</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="public">
            <DropdownMenuRadioItem value="public">공개</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="private">비공개</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
} satisfies Story;
