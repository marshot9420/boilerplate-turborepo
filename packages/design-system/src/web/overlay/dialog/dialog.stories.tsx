import type { Meta, StoryObj } from "@storybook/react-vite";

import Dialog, {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta = {
  title: "Web/Overlay/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => {
    return (
      <Dialog>
        <DialogTrigger className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium">
          열기
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>웹 다이얼로그</DialogTitle>
            <DialogDescription>서비스 화면에서 사용하는 기본 다이얼로그입니다.</DialogDescription>
          </DialogHeader>

          <div className="text-foreground text-sm">
            사용자 확인, 안내, 설정 변경 등의 흐름에 사용할 수 있습니다.
          </div>

          <DialogFooter>
            <DialogClose className="border-border rounded-md border px-4 py-2 text-sm">
              닫기
            </DialogClose>
            <DialogClose className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium">
              확인
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex gap-3">
        {(["sm", "md", "lg"] as const).map((size) => {
          return (
            <Dialog key={size}>
              <DialogTrigger className="border-border rounded-md border px-4 py-2 text-sm">
                {size}
              </DialogTrigger>

              <DialogContent size={size}>
                <DialogHeader>
                  <DialogTitle>size={size}</DialogTitle>
                  <DialogDescription>다이얼로그 크기 variant 예시입니다.</DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <DialogClose className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium">
                    닫기
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    );
  },
} satisfies Story;
