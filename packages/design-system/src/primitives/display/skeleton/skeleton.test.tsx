import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import Skeleton from "./skeleton";

describe("Skeleton", () => {
  it("skeleton을 렌더링한다", () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("기본 shape을 data attribute로 노출한다", () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute(
      "data-shape",
      "rectangle",
    );
  });

  it("전달한 shape을 data attribute로 노출한다", () => {
    render(<Skeleton data-testid="skeleton" shape="circle" />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute(
      "data-shape",
      "circle",
    );
  });

  it("기본 aria-hidden은 true다", () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("aria-hidden을 직접 지정할 수 있다", () => {
    render(<Skeleton data-testid="skeleton" aria-hidden={false} />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
  });

  it("shape class를 적용한다", () => {
    render(<Skeleton data-testid="skeleton" shape="text" />);

    expect(screen.getByTestId("skeleton")).toHaveClass("h-4");
  });

  it("className을 병합한다", () => {
    render(<Skeleton data-testid="skeleton" className="custom-skeleton" />);

    expect(screen.getByTestId("skeleton")).toHaveClass("custom-skeleton");
  });

  it("ref를 div element로 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Skeleton ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
