import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Section from "./section";

describe("Web Section", () => {
  it("section과 children을 렌더링한다", () => {
    render(
      <Section data-testid="section">
        <span>웹 섹션</span>
      </Section>,
    );

    const section = screen.getByTestId("section");

    expect(section.tagName).toBe("SECTION");
    expect(screen.getByText("웹 섹션")).toBeInTheDocument();
  });

  it("web 기본값은 spacing=lg, surface=none, border=false이다", () => {
    render(<Section data-testid="section" />);

    const section = screen.getByTestId("section");

    expect(section).toHaveAttribute("data-spacing", "lg");
    expect(section).toHaveAttribute("data-surface", "none");
    expect(section).toHaveAttribute("data-border", "false");
    expect(section).toHaveClass("w-full", "min-w-0", "py-14", "sm:py-16");
    expect(section).not.toHaveClass("border-y");
  });

  it("spacing을 지정할 수 있다", () => {
    render(<Section data-testid="section" spacing="xl" />);

    const section = screen.getByTestId("section");

    expect(section).toHaveAttribute("data-spacing", "xl");
    expect(section).toHaveClass("py-20", "sm:py-24");
  });

  it("spacing none을 지정할 수 있다", () => {
    render(<Section data-testid="section" spacing="none" />);

    const section = screen.getByTestId("section");

    expect(section).toHaveAttribute("data-spacing", "none");
    expect(section).not.toHaveClass("py-6");
    expect(section).not.toHaveClass("py-10");
    expect(section).not.toHaveClass("py-14");
    expect(section).not.toHaveClass("py-20");
  });

  it("surface background를 지정할 수 있다", () => {
    render(<Section data-testid="section" surface="background" />);

    const section = screen.getByTestId("section");

    expect(section).toHaveAttribute("data-surface", "background");
    expect(section).toHaveClass("bg-background", "text-foreground");
  });

  it("surface surface를 지정할 수 있다", () => {
    render(<Section data-testid="section" surface="surface" />);

    const section = screen.getByTestId("section");

    expect(section).toHaveAttribute("data-surface", "surface");
    expect(section).toHaveClass("bg-surface", "text-surface-foreground");
  });

  it("surface muted를 지정할 수 있다", () => {
    render(<Section data-testid="section" surface="muted" />);

    const section = screen.getByTestId("section");

    expect(section).toHaveAttribute("data-surface", "muted");
    expect(section).toHaveClass("bg-muted", "text-foreground");
  });

  it("border를 true로 지정할 수 있다", () => {
    render(<Section data-testid="section" border />);

    const section = screen.getByTestId("section");

    expect(section).toHaveAttribute("data-border", "true");
    expect(section).toHaveClass("border-border", "border-y");
  });

  it("className을 병합한다", () => {
    render(<Section data-testid="section" className="custom-section" />);

    expect(screen.getByTestId("section")).toHaveClass("min-w-0", "custom-section");
  });

  it("HTML section 속성을 전달한다", () => {
    render(<Section data-testid="section" id="web-section" aria-label="웹 영역" />);

    const section = screen.getByTestId("section");

    expect(section).toHaveAttribute("id", "web-section");
    expect(section).toHaveAttribute("aria-label", "웹 영역");
  });
});
