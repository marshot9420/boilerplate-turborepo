import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Container from "./container";

describe("Admin Container", () => {
  it("children을 렌더링한다", () => {
    render(
      <Container data-testid="container">
        <span>관리자 콘텐츠</span>
      </Container>,
    );

    expect(screen.getByText("관리자 콘텐츠")).toBeInTheDocument();
  });

  it("admin 기본값은 full, md, centered=false이다", () => {
    render(<Container data-testid="container" />);

    const container = screen.getByTestId("container");

    expect(container).toHaveAttribute("data-size", "full");
    expect(container).toHaveAttribute("data-padding", "md");
    expect(container).toHaveAttribute("data-centered", "false");
    expect(container).toHaveClass("max-w-none");
    expect(container).not.toHaveClass("mx-auto");
  });

  it("size를 지정할 수 있다", () => {
    render(<Container data-testid="container" size="lg" />);

    const container = screen.getByTestId("container");

    expect(container).toHaveAttribute("data-size", "lg");
    expect(container).toHaveClass("max-w-5xl");
  });

  it("padding을 지정할 수 있다", () => {
    render(<Container data-testid="container" padding="lg" />);

    const container = screen.getByTestId("container");

    expect(container).toHaveAttribute("data-padding", "lg");
    expect(container).toHaveClass("px-6", "sm:px-8", "lg:px-10");
  });

  it("padding none을 지정할 수 있다", () => {
    render(<Container data-testid="container" padding="none" />);

    const container = screen.getByTestId("container");

    expect(container).toHaveAttribute("data-padding", "none");
    expect(container).not.toHaveClass("px-4");
    expect(container).not.toHaveClass("px-6");
  });

  it("centered를 true로 지정할 수 있다", () => {
    render(<Container data-testid="container" centered />);

    const container = screen.getByTestId("container");

    expect(container).toHaveAttribute("data-centered", "true");
    expect(container).toHaveClass("mx-auto");
  });

  it("className을 병합한다", () => {
    render(<Container data-testid="container" className="custom-container" />);

    expect(screen.getByTestId("container")).toHaveClass("min-w-0", "custom-container");
  });

  it("HTML div 속성을 전달한다", () => {
    render(<Container data-testid="container" id="admin-container" />);

    expect(screen.getByTestId("container")).toHaveAttribute("id", "admin-container");
  });
});
