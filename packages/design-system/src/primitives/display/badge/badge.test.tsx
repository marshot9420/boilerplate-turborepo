import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import Badge from "./badge";

describe("Badge", () => {
  it("children을 렌더링한다", () => {
    render(<Badge>게시됨</Badge>);

    expect(screen.getByText("게시됨")).toBeInTheDocument();
  });

  it("기본 variant와 size를 data attribute로 노출한다", () => {
    render(<Badge>게시됨</Badge>);

    const badge = screen.getByText("게시됨");

    expect(badge).toHaveAttribute("data-variant", "default");
    expect(badge).toHaveAttribute("data-size", "md");
  });

  it("전달한 variant와 size를 data attribute로 노출한다", () => {
    render(
      <Badge variant="destructive" size="lg">
        삭제됨
      </Badge>,
    );

    const badge = screen.getByText("삭제됨");

    expect(badge).toHaveAttribute("data-variant", "destructive");
    expect(badge).toHaveAttribute("data-size", "lg");
  });

  it("variant class를 적용한다", () => {
    render(<Badge variant="muted">임시저장</Badge>);

    const badge = screen.getByText("임시저장");

    expect(badge).toHaveClass("bg-muted");
    expect(badge).toHaveClass("text-foreground");
  });

  it("size class를 적용한다", () => {
    render(<Badge size="sm">작게</Badge>);

    const badge = screen.getByText("작게");

    expect(badge).toHaveClass("h-5");
    expect(badge).toHaveClass("px-2");
    expect(badge).toHaveClass("text-xs");
  });

  it("className을 병합한다", () => {
    render(<Badge className="custom-badge">게시됨</Badge>);

    expect(screen.getByText("게시됨")).toHaveClass("custom-badge");
  });

  it("ref를 span element로 전달한다", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Badge ref={ref}>게시됨</Badge>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
