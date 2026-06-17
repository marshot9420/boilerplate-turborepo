import type { Meta, StoryObj } from "@storybook/react-vite";

import ConfirmDialog, {
  ConfirmDialogAction,
  ConfirmDialogCancel,
  ConfirmDialogContent,
  ConfirmDialogDescription,
  ConfirmDialogFooter,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
  ConfirmDialogTrigger,
} from "./confirm-dialog";

const meta = {
  title: "Admin/Feedback/ConfirmDialog",
  component: ConfirmDialog,
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <ConfirmDialog>
        <ConfirmDialogTrigger asChild>
          <button
            type="button"
            className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-medium"
          >
            작업 실행
          </button>
        </ConfirmDialogTrigger>

        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>작업을 실행할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>
              이 작업을 실행하기 전에 내용을 다시 확인해 주세요.
            </ConfirmDialogDescription>
          </ConfirmDialogHeader>

          <ConfirmDialogFooter>
            <ConfirmDialogCancel>취소</ConfirmDialogCancel>
            <ConfirmDialogAction>실행</ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    );
  },
};

export const Danger: Story = {
  render: () => {
    return (
      <ConfirmDialog>
        <ConfirmDialogTrigger asChild>
          <button
            type="button"
            className="bg-destructive text-destructive-foreground rounded-md px-3 py-2 text-sm font-medium"
          >
            삭제
          </button>
        </ConfirmDialogTrigger>

        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>정말 삭제할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>삭제된 데이터는 복구할 수 없습니다.</ConfirmDialogDescription>
          </ConfirmDialogHeader>

          <ConfirmDialogFooter>
            <ConfirmDialogCancel>취소</ConfirmDialogCancel>
            <ConfirmDialogAction tone="danger">삭제</ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    );
  },
};

export const Loading: Story = {
  render: () => {
    return (
      <ConfirmDialog defaultOpen>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>처리 중입니다</ConfirmDialogTitle>
            <ConfirmDialogDescription>
              요청을 처리하는 동안 잠시 기다려 주세요.
            </ConfirmDialogDescription>
          </ConfirmDialogHeader>

          <ConfirmDialogFooter>
            <ConfirmDialogCancel disabled>취소</ConfirmDialogCancel>
            <ConfirmDialogAction loading loadingText="저장 중...">
              저장
            </ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    );
  },
};

export const CustomContent: Story = {
  render: () => {
    return (
      <ConfirmDialog>
        <ConfirmDialogTrigger asChild>
          <button
            type="button"
            className="border-border bg-background text-foreground rounded-md border px-3 py-2 text-sm font-medium"
          >
            상세 확인
          </button>
        </ConfirmDialogTrigger>

        <ConfirmDialogContent className="max-w-xl">
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>관리자 작업 확인</ConfirmDialogTitle>
            <ConfirmDialogDescription>
              이 작업은 여러 데이터에 영향을 줄 수 있습니다. 실행 전 영향을 받는 범위를 확인해
              주세요.
            </ConfirmDialogDescription>
          </ConfirmDialogHeader>

          <div className="border-border bg-muted/40 rounded-md border p-3 text-sm">
            영향을 받는 항목: 12개
          </div>

          <ConfirmDialogFooter>
            <ConfirmDialogCancel>취소</ConfirmDialogCancel>
            <ConfirmDialogAction>확인 후 실행</ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    );
  },
};
