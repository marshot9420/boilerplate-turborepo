import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Container from "./container";

describe("Web Container", () => {
  it("children을 렌더링한다", () => {
    render(
      <Container data-testid="container">
        <span>웹 콘텐츠</span>
      </Container>,
    );

    expect(screen.getByText("웹 콘텐츠")).toBeInTheDocument();
  });

  it("web 기본값은 xl, md, centered=true이다", () => {
    render(<Container data-testid="container" />);

    const container = screen.getByTestId("container");

    expect(container).toHaveAttribute("data-size", "xl");
    expect(container).toHaveAttribute("data-padding", "md");
    expect(container).toHaveAttribute("data-centered", "true");
    expect(container).toHaveClass("max-w-7xl");
    expect(container).toHaveClass("mx-auto");
  });

  it("size를 지정할 수 있다", () => {
    render(<Container data-testid="container" size="2xl" />);

    const container = screen.getByTestId("container");

    expect(container).toHaveAttribute("data-size", "2xl");
    expect(container).toHaveClass("max-w-screen-2xl");
  });

  it("padding을 지정할 수 있다", () => {
    render(<Container data-testid="container" padding="sm" />);

    const container = screen.getByTestId("container");

    expect(container).toHaveAttribute("data-padding", "sm");
    expect(container).toHaveClass("px-4");
  });

  it("padding none을 지정할 수 있다", () => {
    render(<Container data-testid="container" padding="none" />);

    const container = screen.getByTestId("container");

    expect(container).toHaveAttribute("data-padding", "none");
    expect(container).not.toHaveClass("px-4");
    expect(container).not.toHaveClass("px-6");
  });

  it("centered를 false로 지정할 수 있다", () => {
    render(<Container data-testid="container" centered={false} />);

    const container = screen.getByTestId("container");

    expect(container).toHaveAttribute("data-centered", "false");
    expect(container).not.toHaveClass("mx-auto");
  });

  it("className을 병합한다", () => {
    render(<Container data-testid="container" className="custom-container" />);

    expect(screen.getByTestId("container")).toHaveClass("min-w-0", "custom-container");
  });

  it("HTML div 속성을 전달한다", () => {
    render(<Container data-testid="container" id="web-container" />);

    expect(screen.getByTestId("container")).toHaveAttribute("id", "web-container");
  });
});
