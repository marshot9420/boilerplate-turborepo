import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createRef } from "react";

import Button from "./button";

describe("Admin Button", () => {
  it("button을 렌더링한다", () => {
    render(<Button>저장</Button>);

    const button = screen.getByRole("button", {
      name: "저장",
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-ds-component", "button");
  });

  it("admin button 스타일을 적용한다", () => {
    render(<Button>저장</Button>);

    const button = screen.getByRole("button", {
      name: "저장",
    });

    expect(button).toHaveClass("rounded-md");
    expect(button).toHaveClass("font-semibold");
    expect(button).toHaveClass("shadow-none");
  });

  it("admin 기본 size는 md 스타일을 적용한다", () => {
    render(<Button>저장</Button>);

    const button = screen.getByRole("button", {
      name: "저장",
    });

    expect(button).toHaveClass("h-9");
    expect(button).toHaveClass("px-3.5");
  });

  it("variant, size, fullWidth 상태를 전달한다", () => {
    render(
      <Button fullWidth size="lg" variant="outline">
        수정
      </Button>,
    );

    const button = screen.getByRole("button", {
      name: "수정",
    });

    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-size", "lg");
    expect(button).toHaveAttribute("data-full-width", "true");
  });

  it("loading 상태면 disabled와 aria-busy를 적용한다", () => {
    render(<Button loading>처리 중</Button>);

    const button = screen.getByRole("button", {
      name: "처리 중",
    });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading", "true");
    expect(button).toHaveAttribute("data-disabled", "true");
  });

  it("leftSlot과 rightSlot을 렌더링한다", () => {
    render(
      <Button
        leftSlot={<span data-testid="left-slot">+</span>}
        rightSlot={<span data-testid="right-slot">⌘</span>}
      >
        생성
      </Button>,
    );

    expect(screen.getByTestId("left-slot")).toBeInTheDocument();
    expect(screen.getByText("생성")).toBeInTheDocument();
    expect(screen.getByTestId("right-slot")).toBeInTheDocument();
  });

  it("className을 병합한다", () => {
    render(<Button className="custom-class">저장</Button>);

    const button = screen.getByRole("button", {
      name: "저장",
    });

    expect(button).toHaveClass("custom-class");
    expect(button).toHaveClass("rounded-md");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>저장</Button>);

    const button = screen.getByRole("button", {
      name: "저장",
    });

    expect(ref.current).toBe(button);
  });

  it("클릭 이벤트를 호출한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>저장</Button>);

    await user.click(
      screen.getByRole("button", {
        name: "저장",
      }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
