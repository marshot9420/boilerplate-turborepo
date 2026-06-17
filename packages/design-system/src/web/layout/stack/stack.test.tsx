import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Stack from "./stack";

describe("Web Stack", () => {
  it("children을 렌더링한다", () => {
    render(
      <Stack data-testid="stack">
        <span>웹 항목</span>
      </Stack>,
    );

    expect(screen.getByText("웹 항목")).toBeInTheDocument();
  });

  it("기본값은 vertical, md, stretch, start, wrap=false, fullWidth=false이다", () => {
    render(<Stack data-testid="stack" />);

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveAttribute("data-direction", "vertical");
    expect(stack).toHaveAttribute("data-gap", "md");
    expect(stack).toHaveAttribute("data-align", "stretch");
    expect(stack).toHaveAttribute("data-justify", "start");
    expect(stack).toHaveAttribute("data-wrap", "false");
    expect(stack).toHaveAttribute("data-full-width", "false");
    expect(stack).toHaveClass("flex", "flex-col", "gap-4", "items-stretch", "justify-start");
  });

  it("horizontal 방향을 지정할 수 있다", () => {
    render(<Stack data-testid="stack" direction="horizontal" />);

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveAttribute("data-direction", "horizontal");
    expect(stack).toHaveClass("flex-row");
  });

  it("gap을 지정할 수 있다", () => {
    render(<Stack data-testid="stack" gap="xs" />);

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveAttribute("data-gap", "xs");
    expect(stack).toHaveClass("gap-1");
  });

  it("gap none을 지정할 수 있다", () => {
    render(<Stack data-testid="stack" gap="none" />);

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveAttribute("data-gap", "none");
    expect(stack).not.toHaveClass("gap-1");
    expect(stack).not.toHaveClass("gap-2");
    expect(stack).not.toHaveClass("gap-4");
    expect(stack).not.toHaveClass("gap-6");
    expect(stack).not.toHaveClass("gap-8");
  });

  it("align을 지정할 수 있다", () => {
    render(<Stack data-testid="stack" align="end" />);

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveAttribute("data-align", "end");
    expect(stack).toHaveClass("items-end");
  });

  it("baseline align을 지정할 수 있다", () => {
    render(<Stack data-testid="stack" align="baseline" />);

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveAttribute("data-align", "baseline");
    expect(stack).toHaveClass("items-baseline");
  });

  it("justify를 지정할 수 있다", () => {
    render(<Stack data-testid="stack" justify="evenly" />);

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveAttribute("data-justify", "evenly");
    expect(stack).toHaveClass("justify-evenly");
  });

  it("wrap을 지정할 수 있다", () => {
    render(<Stack data-testid="stack" wrap />);

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveAttribute("data-wrap", "true");
    expect(stack).toHaveClass("flex-wrap");
  });

  it("fullWidth를 지정할 수 있다", () => {
    render(<Stack data-testid="stack" fullWidth />);

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveAttribute("data-full-width", "true");
    expect(stack).toHaveClass("w-full");
  });

  it("className을 병합한다", () => {
    render(<Stack data-testid="stack" className="custom-stack" />);

    expect(screen.getByTestId("stack")).toHaveClass("min-w-0", "custom-stack");
  });

  it("HTML div 속성을 전달한다", () => {
    render(<Stack data-testid="stack" id="web-stack" />);

    expect(screen.getByTestId("stack")).toHaveAttribute("id", "web-stack");
  });
});
