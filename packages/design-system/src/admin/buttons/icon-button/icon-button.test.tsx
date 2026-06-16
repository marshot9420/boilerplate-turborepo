import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createRef } from "react";

import IconButton from "./icon-button";

describe("Admin IconButton", () => {
  it("icon button을 렌더링한다", () => {
    render(
      <IconButton aria-label="검색">
        <span aria-hidden="true">⌕</span>
      </IconButton>,
    );

    const button = screen.getByRole("button", {
      name: "검색",
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-ds-component", "icon-button");
  });

  it("admin icon button 스타일을 적용한다", () => {
    render(
      <IconButton aria-label="검색">
        <span aria-hidden="true">⌕</span>
      </IconButton>,
    );

    const button = screen.getByRole("button", {
      name: "검색",
    });

    expect(button).toHaveClass("shadow-none");
    expect(button).toHaveClass("h-9");
    expect(button).toHaveClass("w-9");
    expect(button).toHaveClass("text-lg");
  });

  it("variant, size, shape 상태를 전달한다", () => {
    render(
      <IconButton aria-label="삭제" shape="circle" size="lg" variant="destructive">
        <span aria-hidden="true">×</span>
      </IconButton>,
    );

    const button = screen.getByRole("button", {
      name: "삭제",
    });

    expect(button).toHaveAttribute("data-variant", "destructive");
    expect(button).toHaveAttribute("data-size", "lg");
    expect(button).toHaveAttribute("data-shape", "circle");
  });

  it("aria-labelledby를 accessible name으로 사용할 수 있다", () => {
    render(
      <>
        <span id="icon-button-label">설정</span>

        <IconButton aria-labelledby="icon-button-label">
          <span aria-hidden="true">⚙</span>
        </IconButton>
      </>,
    );

    expect(
      screen.getByRole("button", {
        name: "설정",
      }),
    ).toBeInTheDocument();
  });

  it("loading 상태면 disabled와 aria-busy를 적용한다", () => {
    render(
      <IconButton aria-label="저장 중" loading>
        <span aria-hidden="true">…</span>
      </IconButton>,
    );

    const button = screen.getByRole("button", {
      name: "저장 중",
    });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading", "true");
    expect(button).toHaveAttribute("data-disabled", "true");
  });

  it("className을 병합한다", () => {
    render(
      <IconButton aria-label="검색" className="custom-class">
        <span aria-hidden="true">⌕</span>
      </IconButton>,
    );

    const button = screen.getByRole("button", {
      name: "검색",
    });

    expect(button).toHaveClass("custom-class");
    expect(button).toHaveClass("shadow-none");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <IconButton ref={ref} aria-label="검색">
        <span aria-hidden="true">⌕</span>
      </IconButton>,
    );

    const button = screen.getByRole("button", {
      name: "검색",
    });

    expect(ref.current).toBe(button);
  });

  it("클릭 이벤트를 호출한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <IconButton aria-label="검색" onClick={handleClick}>
        <span aria-hidden="true">⌕</span>
      </IconButton>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "검색",
      }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
