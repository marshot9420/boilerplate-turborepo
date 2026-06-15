import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRef } from "react";

import { Button } from "./button";

describe("Button", () => {
  it("children을 렌더링하고 기본 type은 button이다", () => {
    render(<Button>저장</Button>);

    const button = screen.getByRole("button", { name: "저장" });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
  });

  it("전달한 type을 우선 사용한다", () => {
    render(<Button type="submit">제출</Button>);

    const button = screen.getByRole("button", { name: "제출" });

    expect(button).toHaveAttribute("type", "submit");
  });

  it("className을 병합한다", () => {
    render(<Button className="custom-button">저장</Button>);

    const button = screen.getByRole("button", { name: "저장" });

    expect(button).toHaveClass("custom-button");
  });

  it("variant, size, fullWidth 상태를 data attribute로 노출한다", () => {
    render(
      <Button variant="outline" size="lg" fullWidth>
        저장
      </Button>,
    );

    const button = screen.getByRole("button", { name: "저장" });

    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-size", "lg");
    expect(button).toHaveAttribute("data-full-width", "true");
  });

  it("기본 variant, size 상태를 data attribute로 노출한다", () => {
    render(<Button>저장</Button>);

    const button = screen.getByRole("button", { name: "저장" });

    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-size", "md");
    expect(button).toHaveAttribute("data-full-width", "false");
  });

  it("disabled가 true이면 버튼이 비활성화된다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        저장
      </Button>,
    );

    const button = screen.getByRole("button", { name: "저장" });

    await user.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-disabled", "true");
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("loading이 true이면 버튼이 비활성화되고 aria-busy를 노출한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button loading onClick={handleClick}>
        저장
      </Button>,
    );

    const button = screen.getByRole("button", { name: "저장" });

    await user.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading", "true");
    expect(button).toHaveAttribute("data-disabled", "true");
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("loading이 false이면 aria-busy를 노출하지 않는다", () => {
    render(<Button>저장</Button>);

    const button = screen.getByRole("button", { name: "저장" });

    expect(button).not.toHaveAttribute("aria-busy");
    expect(button).toHaveAttribute("data-loading", "false");
  });

  it("leftSlot과 rightSlot을 렌더링한다", () => {
    render(
      <Button
        leftSlot={<span data-testid="left-slot">L</span>}
        rightSlot={<span data-testid="right-slot">R</span>}
      >
        저장
      </Button>,
    );

    const button = screen.getByRole("button");

    expect(screen.getByTestId("left-slot")).toBeInTheDocument();
    expect(screen.getByTestId("right-slot")).toBeInTheDocument();
    expect(button).toHaveTextContent("L저장R");
  });

  it("클릭 이벤트를 호출한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>저장</Button>);

    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("ref를 button element로 전달한다", () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>저장</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent("저장");
  });
});
