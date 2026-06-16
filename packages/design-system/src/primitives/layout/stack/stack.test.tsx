import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import Stack from "./stack";

describe("Stack", () => {
  it("children을 렌더링한다", () => {
    render(
      <Stack>
        <span>첫 번째</span>
        <span>두 번째</span>
      </Stack>,
    );

    expect(screen.getByText("첫 번째")).toBeInTheDocument();
    expect(screen.getByText("두 번째")).toBeInTheDocument();
  });

  it("기본 data attribute를 렌더링한다", () => {
    render(<Stack data-testid="stack">콘텐츠</Stack>);

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveAttribute("data-direction", "vertical");
    expect(stack).toHaveAttribute("data-gap", "md");
    expect(stack).toHaveAttribute("data-align", "stretch");
    expect(stack).toHaveAttribute("data-justify", "start");
    expect(stack).toHaveAttribute("data-wrap", "false");
    expect(stack).toHaveAttribute("data-full-width", "false");
  });

  it("layout prop을 data attribute로 렌더링한다", () => {
    render(
      <Stack
        data-testid="stack"
        direction="horizontal"
        gap="lg"
        align="center"
        justify="between"
        wrap
        fullWidth
      >
        콘텐츠
      </Stack>,
    );

    const stack = screen.getByTestId("stack");

    expect(stack).toHaveAttribute("data-direction", "horizontal");
    expect(stack).toHaveAttribute("data-gap", "lg");
    expect(stack).toHaveAttribute("data-align", "center");
    expect(stack).toHaveAttribute("data-justify", "between");
    expect(stack).toHaveAttribute("data-wrap", "true");
    expect(stack).toHaveAttribute("data-full-width", "true");
  });

  it("className을 병합한다", () => {
    render(
      <Stack data-testid="stack" className="custom-stack">
        콘텐츠
      </Stack>,
    );

    expect(screen.getByTestId("stack")).toHaveClass("custom-stack");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Stack ref={ref}>콘텐츠</Stack>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveTextContent("콘텐츠");
  });
});
