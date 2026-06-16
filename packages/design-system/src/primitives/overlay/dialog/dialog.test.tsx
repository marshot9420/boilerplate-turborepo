import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

describe("Dialog", () => {
  it("trigger를 클릭하면 dialog를 연다", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>프로필 수정</DialogTitle>
          <DialogDescription>프로필 정보를 수정합니다.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("프로필 수정")).toBeInTheDocument();
    expect(screen.getByText("프로필 정보를 수정합니다.")).toBeInTheDocument();
  });

  it("close를 클릭하면 dialog를 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>삭제 확인</DialogTitle>
          <DialogDescription>정말 삭제하시겠습니까?</DialogDescription>
          <DialogClose>닫기</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "닫기" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Escape를 누르면 dialog를 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>설정</DialogTitle>
          <DialogDescription>설정을 변경합니다.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("defaultOpen이면 처음부터 dialog를 렌더링한다", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>열린 다이얼로그</DialogTitle>
          <DialogDescription>처음부터 열린 상태입니다.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("열린 다이얼로그")).toBeInTheDocument();
  });

  it("DialogContent의 size를 data attribute로 노출한다", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent size="lg">
          <DialogTitle>큰 다이얼로그</DialogTitle>
          <DialogDescription>큰 다이얼로그입니다.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "lg");
  });

  it("DialogContent의 기본 size는 md다", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>기본 다이얼로그</DialogTitle>
          <DialogDescription>기본 크기입니다.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "md");
  });

  it("className을 병합한다", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent className="custom-dialog-content">
          <DialogTitle>커스텀 다이얼로그</DialogTitle>
          <DialogDescription>커스텀 클래스입니다.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toHaveClass("custom-dialog-content");
  });

  it("header와 footer를 렌더링한다", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader data-testid="dialog-header">
            <DialogTitle>제목</DialogTitle>
            <DialogDescription>설명</DialogDescription>
          </DialogHeader>

          <DialogFooter data-testid="dialog-footer">
            <button type="button">확인</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByTestId("dialog-header")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-footer")).toBeInTheDocument();
  });

  it("DialogContent ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Dialog defaultOpen>
        <DialogContent ref={ref}>
          <DialogTitle>Ref Dialog</DialogTitle>
          <DialogDescription>ref 테스트입니다.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
