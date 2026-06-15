import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRef } from "react";

import IconButton from "./icon-button";

describe("IconButton", () => {
  it("accessible name과 children을 렌더링한다", () => {
    render(<IconButton aria-label="닫기">X</IconButton>);

    expect(screen.getByRole("button", { name: "닫기" })).toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
  });

  it("기본 type은 button이다", () => {
    render(<IconButton aria-label="닫기">X</IconButton>);

    expect(screen.getByRole("button", { name: "닫기" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("전달한 type을 우선 사용한다", () => {
    render(
      <IconButton aria-label="저장" type="submit">
        S
      </IconButton>,
    );

    expect(screen.getByRole("button", { name: "저장" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("variant, size, shape 상태를 data attribute로 노출한다", () => {
    render(
      <IconButton
        aria-label="삭제"
        variant="destructive"
        size="lg"
        shape="circle"
      >
        D
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "삭제" });

    expect(button).toHaveAttribute("data-variant", "destructive");
    expect(button).toHaveAttribute("data-size", "lg");
    expect(button).toHaveAttribute("data-shape", "circle");
  });

  it("기본 상태를 data attribute로 노출한다", () => {
    render(<IconButton aria-label="닫기">X</IconButton>);

    const button = screen.getByRole("button", { name: "닫기" });

    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-size", "md");
    expect(button).toHaveAttribute("data-shape", "square");
  });

  it("className을 병합한다", () => {
    render(
      <IconButton aria-label="닫기" className="custom-icon-button">
        X
      </IconButton>,
    );

    expect(screen.getByRole("button", { name: "닫기" })).toHaveClass(
      "custom-icon-button",
    );
  });

  it("클릭 이벤트를 호출한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <IconButton aria-label="닫기" onClick={handleClick}>
        X
      </IconButton>,
    );

    await user.click(screen.getByRole("button", { name: "닫기" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태에서는 클릭 이벤트를 호출하지 않는다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <IconButton aria-label="닫기" disabled onClick={handleClick}>
        X
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "닫기" });

    await user.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-disabled", "true");
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("loading 상태에서는 비활성화되고 aria-busy를 노출한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <IconButton aria-label="저장 중" loading onClick={handleClick}>
        S
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "저장 중" });

    await user.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading", "true");
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("ref를 button element로 전달한다", () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <IconButton ref={ref} aria-label="닫기">
        X
      </IconButton>,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
