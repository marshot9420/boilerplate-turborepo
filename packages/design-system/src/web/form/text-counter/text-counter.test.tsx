import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import TextCounter from "./text-counter";

describe("Web TextCounter", () => {
  it("value의 길이를 렌더링한다", () => {
    render(<TextCounter value="hello" />);

    const counter = screen.getByText("5");

    expect(counter).toHaveAttribute("data-count", "5");
    expect(counter).toHaveAttribute("data-over-limit", "false");
    expect(counter).toHaveAttribute("aria-live", "polite");
  });

  it("maxLength가 있으면 현재 길이와 최대 길이를 함께 렌더링한다", () => {
    render(<TextCounter value="hello" maxLength={10} />);

    const counter = screen.getByText("5 / 10");

    expect(counter).toHaveAttribute("data-count", "5");
    expect(counter).toHaveAttribute("data-max-length", "10");
  });

  it("count가 있으면 value보다 count를 우선한다", () => {
    render(<TextCounter value="hello" count={3} maxLength={10} />);

    const counter = screen.getByText("3 / 10");

    expect(counter).toHaveAttribute("data-count", "3");
  });

  it("maxLength를 초과하면 over limit 상태를 적용한다", () => {
    render(<TextCounter count={12} maxLength={10} />);

    const counter = screen.getByText("12 / 10");

    expect(counter).toHaveAttribute("data-over-limit", "true");
    expect(counter).toHaveClass("text-destructive");
  });

  it("align을 적용한다", () => {
    render(<TextCounter value="hello" align="center" />);

    const counter = screen.getByText("5");

    expect(counter).toHaveClass("text-center");
  });

  it("fullWidth를 적용한다", () => {
    render(<TextCounter value="hello" fullWidth />);

    const counter = screen.getByText("5");

    expect(counter).toHaveAttribute("data-full-width", "true");
    expect(counter).toHaveClass("block");
    expect(counter).toHaveClass("w-full");
  });

  it("aria-live를 덮어쓸 수 있다", () => {
    render(<TextCounter value="hello" aria-live="off" />);

    expect(screen.getByText("5")).toHaveAttribute("aria-live", "off");
  });

  it("size를 적용한다", () => {
    render(<TextCounter value="hello" size="md" />);

    const counter = screen.getByText("5");

    expect(counter).toHaveAttribute("data-size", "md");
    expect(counter).toHaveClass("text-sm");
  });

  it("weight를 적용한다", () => {
    render(<TextCounter value="hello" weight="medium" />);

    const counter = screen.getByText("5");

    expect(counter).toHaveAttribute("data-weight", "medium");
    expect(counter).toHaveClass("font-medium");
  });

  it("className을 병합한다", () => {
    render(<TextCounter value="hello" className="custom-counter" />);

    expect(screen.getByText("5")).toHaveClass("custom-counter");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<TextCounter ref={ref} value="hello" />);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
