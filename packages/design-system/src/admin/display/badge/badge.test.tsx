import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import Badge from "./badge";

describe("Admin Badge", () => {
  it("badge를 렌더링한다", () => {
    render(<Badge>ACTIVE</Badge>);

    const badge = screen.getByText("ACTIVE");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-ds-component", "badge");
  });

  it("admin badge 스타일을 적용한다", () => {
    render(<Badge>ACTIVE</Badge>);

    const badge = screen.getByText("ACTIVE");

    expect(badge).toHaveClass("shadow-none");
    expect(badge).toHaveClass("font-semibold");
    expect(badge).toHaveClass("uppercase");
    expect(badge).toHaveClass("tracking-wide");
  });

  it("variant와 size 상태를 전달한다", () => {
    render(
      <Badge size="lg" variant="outline">
        PENDING
      </Badge>,
    );

    const badge = screen.getByText("PENDING");

    expect(badge).toHaveAttribute("data-variant", "outline");
    expect(badge).toHaveAttribute("data-size", "lg");
    expect(badge).toHaveClass("h-7");
    expect(badge).toHaveClass("bg-surface");
  });

  it("destructive variant를 적용한다", () => {
    render(<Badge variant="destructive">DELETED</Badge>);

    const badge = screen.getByText("DELETED");

    expect(badge).toHaveAttribute("data-variant", "destructive");
    expect(badge).toHaveClass("bg-destructive");
  });

  it("className을 병합한다", () => {
    render(<Badge className="custom-badge">ACTIVE</Badge>);

    const badge = screen.getByText("ACTIVE");

    expect(badge).toHaveClass("custom-badge");
    expect(badge).toHaveClass("uppercase");
  });

  it("HTML attribute를 전달한다", () => {
    render(
      <Badge aria-label="사용자 상태" title="상태">
        ACTIVE
      </Badge>,
    );

    const badge = screen.getByText("ACTIVE");

    expect(badge).toHaveAttribute("aria-label", "사용자 상태");
    expect(badge).toHaveAttribute("title", "상태");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Badge ref={ref}>ACTIVE</Badge>);

    expect(ref.current).toBe(screen.getByText("ACTIVE"));
  });
});
