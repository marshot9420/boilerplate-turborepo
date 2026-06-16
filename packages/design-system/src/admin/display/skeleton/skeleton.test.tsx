import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import Skeleton from "./skeleton";

describe("Admin Skeleton", () => {
  it("기본 skeleton을 렌더링한다", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).toHaveAttribute("data-shape", "rectangle");
    expect(skeleton).toHaveAttribute("data-variant", "default");
    expect(skeleton).toHaveAttribute("data-animated", "true");
  });

  it("shape을 적용한다", () => {
    render(<Skeleton data-testid="skeleton" shape="circle" />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute("data-shape", "circle");
  });

  it("text shape을 적용한다", () => {
    render(<Skeleton data-testid="skeleton" shape="text" />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveAttribute("data-shape", "text");
    expect(skeleton).toHaveClass("h-4");
  });

  it("variant를 적용한다", () => {
    render(<Skeleton data-testid="skeleton" variant="strong" />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute("data-variant", "strong");
  });

  it("animated가 false이면 animate-none을 적용한다", () => {
    render(<Skeleton data-testid="skeleton" animated={false} />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveAttribute("data-animated", "false");
    expect(skeleton).toHaveClass("animate-none");
  });

  it("aria-hidden을 명시적으로 덮어쓸 수 있다", () => {
    render(<Skeleton data-testid="skeleton" aria-hidden={false} />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "false");
  });

  it("className을 병합한다", () => {
    render(<Skeleton data-testid="skeleton" className="h-10 w-20" />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveClass("h-10");
    expect(skeleton).toHaveClass("w-20");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Skeleton ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
