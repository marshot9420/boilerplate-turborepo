import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import Container from "./container";

describe("Container", () => {
  it("children을 렌더링한다", () => {
    render(<Container>콘텐츠</Container>);

    expect(screen.getByText("콘텐츠")).toBeInTheDocument();
  });

  it("기본 data attribute를 렌더링한다", () => {
    render(<Container>콘텐츠</Container>);

    const container = screen.getByText("콘텐츠");

    expect(container).toHaveAttribute("data-size", "xl");
    expect(container).toHaveAttribute("data-padding", "md");
    expect(container).toHaveAttribute("data-centered", "true");
  });

  it("size, padding, centered 값을 data attribute로 렌더링한다", () => {
    render(
      <Container size="lg" padding="sm" centered={false}>
        콘텐츠
      </Container>,
    );

    const container = screen.getByText("콘텐츠");

    expect(container).toHaveAttribute("data-size", "lg");
    expect(container).toHaveAttribute("data-padding", "sm");
    expect(container).toHaveAttribute("data-centered", "false");
  });

  it("className을 병합한다", () => {
    render(<Container className="custom-container">콘텐츠</Container>);

    expect(screen.getByText("콘텐츠")).toHaveClass("custom-container");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Container ref={ref}>콘텐츠</Container>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveTextContent("콘텐츠");
  });
});
