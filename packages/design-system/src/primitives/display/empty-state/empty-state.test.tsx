import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import EmptyState from "./empty-state";

describe("EmptyState", () => {
  it("heading과 description을 렌더링한다", () => {
    render(<EmptyState heading="콘텐츠가 없습니다" description="새 콘텐츠를 생성해 주세요." />);

    expect(screen.getByText("콘텐츠가 없습니다")).toBeInTheDocument();
    expect(screen.getByText("새 콘텐츠를 생성해 주세요.")).toBeInTheDocument();
  });

  it("icon을 렌더링한다", () => {
    render(<EmptyState icon={<span data-testid="empty-icon">아이콘</span>} heading="비어 있음" />);

    expect(screen.getByTestId("empty-icon")).toBeInTheDocument();
    expect(screen.getByTestId("empty-icon").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("action을 렌더링한다", () => {
    render(<EmptyState heading="비어 있음" action={<button type="button">생성하기</button>} />);

    expect(screen.getByRole("button", { name: "생성하기" })).toBeInTheDocument();
  });

  it("children을 렌더링한다", () => {
    render(
      <EmptyState>
        <span>추가 내용</span>
      </EmptyState>,
    );

    expect(screen.getByText("추가 내용")).toBeInTheDocument();
  });

  it("기본 size와 fullWidth 상태를 data attribute로 노출한다", () => {
    render(<EmptyState data-testid="empty-state" />);

    const emptyState = screen.getByTestId("empty-state");

    expect(emptyState).toHaveAttribute("data-size", "md");
    expect(emptyState).toHaveAttribute("data-full-width", "false");
  });

  it("전달한 size와 fullWidth 상태를 data attribute로 노출한다", () => {
    render(<EmptyState data-testid="empty-state" size="lg" fullWidth />);

    const emptyState = screen.getByTestId("empty-state");

    expect(emptyState).toHaveAttribute("data-size", "lg");
    expect(emptyState).toHaveAttribute("data-full-width", "true");
  });

  it("className을 병합한다", () => {
    render(<EmptyState data-testid="empty-state" className="custom-empty" />);

    expect(screen.getByTestId("empty-state")).toHaveClass("custom-empty");
  });

  it("ref를 div element로 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<EmptyState ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("기본 headingElement는 p로 heading을 렌더링한다", () => {
    render(<EmptyState heading="콘텐츠가 없습니다" />);

    const heading = screen.getByText("콘텐츠가 없습니다");

    expect(heading.tagName).toBe("P");
  });

  it("headingElement로 heading 태그를 변경할 수 있다", () => {
    render(<EmptyState heading="콘텐츠가 없습니다" headingElement="h2" />);

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "콘텐츠가 없습니다",
    });

    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H2");
  });

  it("headingElement 상태를 data attribute로 노출한다", () => {
    render(
      <EmptyState data-testid="empty-state" heading="콘텐츠가 없습니다" headingElement="h3" />,
    );

    expect(screen.getByTestId("empty-state")).toHaveAttribute("data-heading-element", "h3");
  });
});
