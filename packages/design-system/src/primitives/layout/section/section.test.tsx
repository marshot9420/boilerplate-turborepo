import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import Section from "./section";

describe("Section", () => {
  it("children을 렌더링한다", () => {
    render(<Section>섹션 콘텐츠</Section>);

    expect(screen.getByText("섹션 콘텐츠")).toBeInTheDocument();
  });

  it("aria-label이 있으면 region으로 탐색할 수 있다", () => {
    render(<Section aria-label="히어로 섹션">섹션 콘텐츠</Section>);

    expect(screen.getByRole("region", { name: "히어로 섹션" })).toBeInTheDocument();
  });

  it("기본 data attribute를 렌더링한다", () => {
    render(<Section data-testid="section">섹션 콘텐츠</Section>);

    const section = screen.getByTestId("section");

    expect(section).toHaveAttribute("data-spacing", "lg");
    expect(section).toHaveAttribute("data-surface", "none");
    expect(section).toHaveAttribute("data-border", "false");
  });

  it("spacing, surface, border 값을 data attribute로 렌더링한다", () => {
    render(
      <Section data-testid="section" spacing="xl" surface="muted" border>
        섹션 콘텐츠
      </Section>,
    );

    const section = screen.getByTestId("section");

    expect(section).toHaveAttribute("data-spacing", "xl");
    expect(section).toHaveAttribute("data-surface", "muted");
    expect(section).toHaveAttribute("data-border", "true");
  });

  it("className을 병합한다", () => {
    render(
      <Section data-testid="section" className="custom-section">
        섹션 콘텐츠
      </Section>,
    );

    expect(screen.getByTestId("section")).toHaveClass("custom-section");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLElement>();

    render(<Section ref={ref}>섹션 콘텐츠</Section>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("SECTION");
    expect(ref.current).toHaveTextContent("섹션 콘텐츠");
  });
});
