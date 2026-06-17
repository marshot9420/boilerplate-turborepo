import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createRef } from "react";

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

describe("Admin ConfirmDialog", () => {
  it("trigger를 클릭하면 confirm dialog를 연다", async () => {
    const user = userEvent.setup();

    render(
      <ConfirmDialog>
        <ConfirmDialogTrigger>삭제</ConfirmDialogTrigger>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>정말 삭제할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>이 작업은 되돌릴 수 없습니다.</ConfirmDialogDescription>
          </ConfirmDialogHeader>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "삭제",
      }),
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("정말 삭제할까요?")).toBeInTheDocument();
    expect(screen.getByText("이 작업은 되돌릴 수 없습니다.")).toBeInTheDocument();
  });

  it("cancel을 클릭하면 dialog를 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <ConfirmDialog>
        <ConfirmDialogTrigger>열기</ConfirmDialogTrigger>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>작업을 취소할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>현재 작업을 취소합니다.</ConfirmDialogDescription>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter>
            <ConfirmDialogCancel>취소</ConfirmDialogCancel>
            <ConfirmDialogAction>확인</ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "열기",
      }),
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "취소",
      }),
    );

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("action을 클릭하면 onClick을 호출한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <ConfirmDialog>
        <ConfirmDialogTrigger>열기</ConfirmDialogTrigger>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>저장할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>변경사항을 저장합니다.</ConfirmDialogDescription>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter>
            <ConfirmDialogCancel>취소</ConfirmDialogCancel>
            <ConfirmDialogAction onClick={handleClick}>저장</ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "열기",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "저장",
      }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("action tone과 loading 상태를 적용한다", () => {
    render(
      <ConfirmDialog defaultOpen>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>삭제할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>삭제 처리를 진행합니다.</ConfirmDialogDescription>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter>
            <ConfirmDialogAction tone="danger" loading>
              삭제
            </ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    const action = screen.getByRole("button", {
      name: "처리 중...",
    });

    expect(action).toBeDisabled();
    expect(action).toHaveAttribute("data-tone", "danger");
    expect(action).toHaveAttribute("data-loading", "true");
  });

  it("content, cancel, action className을 병합한다", () => {
    render(
      <ConfirmDialog defaultOpen>
        <ConfirmDialogContent className="custom-content">
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>제목</ConfirmDialogTitle>
            <ConfirmDialogDescription>설명</ConfirmDialogDescription>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter>
            <ConfirmDialogCancel className="custom-cancel">취소</ConfirmDialogCancel>
            <ConfirmDialogAction className="custom-action">확인</ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    expect(screen.getByRole("alertdialog")).toHaveClass("custom-content");
    expect(
      screen.getByRole("button", {
        name: "취소",
      }),
    ).toHaveClass("custom-cancel");
    expect(
      screen.getByRole("button", {
        name: "확인",
      }),
    ).toHaveClass("custom-action");
  });

  it("ref를 전달한다", () => {
    const contentRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    const descriptionRef = createRef<HTMLParagraphElement>();
    const cancelRef = createRef<HTMLButtonElement>();
    const actionRef = createRef<HTMLButtonElement>();

    render(
      <ConfirmDialog defaultOpen>
        <ConfirmDialogContent ref={contentRef}>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle ref={titleRef}>제목</ConfirmDialogTitle>
            <ConfirmDialogDescription ref={descriptionRef}>설명</ConfirmDialogDescription>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter>
            <ConfirmDialogCancel ref={cancelRef}>취소</ConfirmDialogCancel>
            <ConfirmDialogAction ref={actionRef}>확인</ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
    expect(descriptionRef.current).toBeInstanceOf(HTMLParagraphElement);
    expect(cancelRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(actionRef.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("loadingText를 지정하면 loading 상태에서 해당 문구를 렌더링한다", () => {
    render(
      <ConfirmDialog defaultOpen>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>삭제할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>삭제 처리를 진행합니다.</ConfirmDialogDescription>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter>
            <ConfirmDialogAction tone="danger" loading loadingText="삭제 중...">
              삭제
            </ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    const action = screen.getByRole("button", {
      name: "삭제 중...",
    });

    expect(action).toBeDisabled();
    expect(action).toHaveAttribute("data-tone", "danger");
    expect(action).toHaveAttribute("data-loading", "true");
  });
});
