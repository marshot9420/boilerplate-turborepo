import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

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

describe("ConfirmDialog", () => {
  it("trigger를 클릭하면 confirm dialog를 연다", async () => {
    const user = userEvent.setup();

    render(
      <ConfirmDialog>
        <ConfirmDialogTrigger>삭제</ConfirmDialogTrigger>

        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>콘텐츠를 삭제할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>삭제한 콘텐츠는 복구할 수 없습니다.</ConfirmDialogDescription>
          </ConfirmDialogHeader>

          <ConfirmDialogFooter>
            <ConfirmDialogCancel>취소</ConfirmDialogCancel>
            <ConfirmDialogAction>삭제</ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("콘텐츠를 삭제할까요?")).toBeInTheDocument();
    expect(screen.getByText("삭제한 콘텐츠는 복구할 수 없습니다.")).toBeInTheDocument();
  });

  it("cancel을 클릭하면 confirm dialog를 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <ConfirmDialog>
        <ConfirmDialogTrigger>삭제</ConfirmDialogTrigger>

        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>콘텐츠를 삭제할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>삭제한 콘텐츠는 복구할 수 없습니다.</ConfirmDialogDescription>
          </ConfirmDialogHeader>

          <ConfirmDialogFooter>
            <ConfirmDialogCancel>취소</ConfirmDialogCancel>
            <ConfirmDialogAction>삭제</ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    await user.click(screen.getByRole("button", { name: "삭제" }));
    await user.click(screen.getByRole("button", { name: "취소" }));

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it("action을 클릭하면 onClick을 호출한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <ConfirmDialog>
        <ConfirmDialogTrigger>삭제</ConfirmDialogTrigger>

        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>콘텐츠를 삭제할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>삭제한 콘텐츠는 복구할 수 없습니다.</ConfirmDialogDescription>
          </ConfirmDialogHeader>

          <ConfirmDialogFooter>
            <ConfirmDialogCancel>취소</ConfirmDialogCancel>
            <ConfirmDialogAction onClick={handleClick}>삭제</ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    await user.click(screen.getByRole("button", { name: "삭제" }));

    const dialog = screen.getByRole("alertdialog");
    const actionButton = within(dialog).getByRole("button", { name: "삭제" });

    await user.click(actionButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("action tone과 loading 상태를 data attribute로 렌더링한다", async () => {
    const user = userEvent.setup();

    render(
      <ConfirmDialog>
        <ConfirmDialogTrigger>열기</ConfirmDialogTrigger>

        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>처리할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>이 작업은 시간이 걸릴 수 있습니다.</ConfirmDialogDescription>
          </ConfirmDialogHeader>

          <ConfirmDialogFooter>
            <ConfirmDialogCancel>취소</ConfirmDialogCancel>
            <ConfirmDialogAction tone="danger" loading>
              실행
            </ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    const actionButton = screen.getByRole("button", { name: "처리 중..." });

    expect(actionButton).toBeDisabled();
    expect(actionButton).toHaveAttribute("data-tone", "danger");
    expect(actionButton).toHaveAttribute("data-loading", "true");
  });

  it("className을 병합한다", async () => {
    const user = userEvent.setup();

    render(
      <ConfirmDialog>
        <ConfirmDialogTrigger>열기</ConfirmDialogTrigger>

        <ConfirmDialogContent className="custom-content">
          <ConfirmDialogHeader className="custom-header">
            <ConfirmDialogTitle className="custom-title">제목</ConfirmDialogTitle>
            <ConfirmDialogDescription className="custom-description">설명</ConfirmDialogDescription>
          </ConfirmDialogHeader>

          <ConfirmDialogFooter className="custom-footer">
            <ConfirmDialogCancel className="custom-cancel">취소</ConfirmDialogCancel>
            <ConfirmDialogAction className="custom-action">확인</ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("alertdialog")).toHaveClass("custom-content");
    expect(screen.getByText("제목").parentElement).toHaveClass("custom-header");
    expect(screen.getByText("제목")).toHaveClass("custom-title");
    expect(screen.getByText("설명")).toHaveClass("custom-description");
    expect(screen.getByText("취소").parentElement).toHaveClass("custom-footer");
    expect(screen.getByRole("button", { name: "취소" })).toHaveClass("custom-cancel");
    expect(screen.getByRole("button", { name: "확인" })).toHaveClass("custom-action");
  });

  it("loadingText를 지정하면 loading 상태에서 해당 문구를 렌더링한다", async () => {
    const user = userEvent.setup();

    render(
      <ConfirmDialog>
        <ConfirmDialogTrigger>열기</ConfirmDialogTrigger>

        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>삭제할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>삭제 처리를 진행합니다.</ConfirmDialogDescription>
          </ConfirmDialogHeader>

          <ConfirmDialogFooter>
            <ConfirmDialogCancel>취소</ConfirmDialogCancel>
            <ConfirmDialogAction tone="danger" loading loadingText="삭제 중...">
              삭제
            </ConfirmDialogAction>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    const actionButton = screen.getByRole("button", {
      name: "삭제 중...",
    });

    expect(actionButton).toBeDisabled();
    expect(actionButton).toHaveAttribute("data-tone", "danger");
    expect(actionButton).toHaveAttribute("data-loading", "true");
  });
});
