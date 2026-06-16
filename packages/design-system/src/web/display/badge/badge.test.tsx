import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import Badge from "./badge";

describe("Web Badge", () => {
  it("badge를 렌더링한다", () => {
    render(<Badge>활성</Badge>);

    const badge = screen.getByText("활성");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-ds-component", "badge");
  });

  it("web badge 스타일을 적용한다", () => {
    render(<Badge>활성</Badge>);

    const badge = screen.getByText("활성");

    expect(badge).toHaveClass("shadow-sm");
    expect(badge).toHaveClass("tracking-tight");
    expect(badge).toHaveClass("h-7");
  });

  it("variant와 size 상태를 전달한다", () => {
    render(
      <Badge size="lg" variant="outline">
        대기
      </Badge>,
    );

    const badge = screen.getByText("대기");

    expect(badge).toHaveAttribute("data-variant", "outline");
    expect(badge).toHaveAttribute("data-size", "lg");
    expect(badge).toHaveClass("h-8");
    expect(badge).toHaveClass("bg-surface");
  });

  it("destructive variant를 적용한다", () => {
    render(<Badge variant="destructive">삭제됨</Badge>);

    const badge = screen.getByText("삭제됨");

    expect(badge).toHaveAttribute("data-variant", "destructive");
    expect(badge).toHaveClass("shadow-destructive/10");
  });

  it("className을 병합한다", () => {
    render(<Badge className="custom-badge">활성</Badge>);

    const badge = screen.getByText("활성");

    expect(badge).toHaveClass("custom-badge");
    expect(badge).toHaveClass("shadow-sm");
  });

  it("HTML attribute를 전달한다", () => {
    render(
      <Badge aria-label="사용자 상태" title="상태">
        활성
      </Badge>,
    );

    const badge = screen.getByText("활성");

    expect(badge).toHaveAttribute("aria-label", "사용자 상태");
    expect(badge).toHaveAttribute("title", "상태");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Badge ref={ref}>활성</Badge>);

    expect(ref.current).toBe(screen.getByText("활성"));
  });
});
