import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Dialog, {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

describe("Admin Dialog", () => {
  it("trigger를 클릭하면 dialog를 연다", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>관리자 다이얼로그</DialogTitle>
          <DialogDescription>관리자 다이얼로그 설명</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("관리자 다이얼로그")).toBeInTheDocument();
    expect(screen.getByText("관리자 다이얼로그 설명")).toBeInTheDocument();
  });

  it("close를 클릭하면 dialog를 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>관리자 다이얼로그</DialogTitle>
          <DialogDescription>관리자 다이얼로그 설명</DialogDescription>
          <DialogClose>닫기</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "닫기" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("size 기본값은 md이다", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>관리자 다이얼로그</DialogTitle>
          <DialogDescription>관리자 다이얼로그 설명</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveAttribute("data-size", "md");
    expect(dialog).toHaveClass("max-w-lg");
  });

  it("size를 지정할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent size="lg">
          <DialogTitle>관리자 다이얼로그</DialogTitle>
          <DialogDescription>관리자 다이얼로그 설명</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveAttribute("data-size", "lg");
    expect(dialog).toHaveClass("max-w-2xl");
  });

  it("header와 footer를 렌더링한다", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogHeader data-testid="header">
            <DialogTitle>제목</DialogTitle>
            <DialogDescription>설명</DialogDescription>
          </DialogHeader>
          <div>본문</div>
          <DialogFooter data-testid="footer">
            <DialogClose>확인</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByTestId("header")).toHaveClass("gap-2");
    expect(screen.getByTestId("footer")).toHaveClass("pt-2");
    expect(screen.getByText("본문")).toBeInTheDocument();
  });

  it("title과 description className을 병합한다", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle className="custom-title">제목</DialogTitle>
          <DialogDescription className="custom-description">설명</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByText("제목")).toHaveClass("tracking-tight", "custom-title");
    expect(screen.getByText("설명")).toHaveClass("leading-6", "custom-description");
  });

  it("content className을 병합한다", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent className="custom-content">
          <DialogTitle>제목</DialogTitle>
          <DialogDescription>설명</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("dialog")).toHaveClass("bg-surface/95", "custom-content");
  });

  it("DialogOverlay를 직접 렌더링할 수 있다", () => {
    render(
      <Dialog open>
        <DialogPortal>
          <DialogOverlay data-testid="overlay" />
        </DialogPortal>
      </Dialog>,
    );

    expect(screen.getByTestId("overlay")).toHaveClass(
      "fixed",
      "inset-0",
      "bg-overlay/55",
      "backdrop-blur-[1px]",
    );
  });

  it("접근성 속성으로 title과 description을 연결한다", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>관리자 제목</DialogTitle>
          <DialogDescription>관리자 설명</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveAccessibleName("관리자 제목");
    expect(dialog).toHaveAccessibleDescription("관리자 설명");
  });
});
