import type { Meta, StoryObj } from "@storybook/react-vite";

import Drawer, {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

const meta = {
  title: "Web/Overlay/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => {
    return (
      <Drawer>
        <DrawerTrigger className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium">
          열기
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>웹 드로어</DrawerTitle>
            <DrawerDescription>서비스 화면에서 사용하는 기본 드로어입니다.</DrawerDescription>
          </DrawerHeader>

          <div className="text-foreground text-sm">
            모바일 메뉴, 필터, 사용자 설정 같은 보조 화면에 사용할 수 있습니다.
          </div>

          <DrawerFooter>
            <DrawerClose className="border-border rounded-md border px-4 py-2 text-sm">
              닫기
            </DrawerClose>
            <DrawerClose className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium">
              확인
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
} satisfies Story;

export const Sides = {
  render: () => {
    return (
      <div className="flex gap-3">
        {(["left", "right", "top", "bottom"] as const).map((side) => {
          return (
            <Drawer key={side}>
              <DrawerTrigger className="border-border rounded-md border px-4 py-2 text-sm">
                {side}
              </DrawerTrigger>

              <DrawerContent side={side}>
                <DrawerHeader>
                  <DrawerTitle>side={side}</DrawerTitle>
                  <DrawerDescription>드로어 방향 variant 예시입니다.</DrawerDescription>
                </DrawerHeader>

                <DrawerFooter>
                  <DrawerClose className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium">
                    닫기
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          );
        })}
      </div>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex gap-3">
        {(["sm", "md", "lg"] as const).map((size) => {
          return (
            <Drawer key={size}>
              <DrawerTrigger className="border-border rounded-md border px-4 py-2 text-sm">
                {size}
              </DrawerTrigger>

              <DrawerContent size={size}>
                <DrawerHeader>
                  <DrawerTitle>size={size}</DrawerTitle>
                  <DrawerDescription>드로어 크기 variant 예시입니다.</DrawerDescription>
                </DrawerHeader>

                <DrawerFooter>
                  <DrawerClose className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium">
                    닫기
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          );
        })}
      </div>
    );
  },
} satisfies Story;
