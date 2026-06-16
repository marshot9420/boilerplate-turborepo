import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import EmptyState from "./empty-state";

describe("Admin EmptyState", () => {
  it("heading과 description을 렌더링한다", () => {
    render(<EmptyState heading="데이터가 없습니다" description="아직 등록된 항목이 없습니다." />);

    expect(screen.getByText("데이터가 없습니다")).toBeInTheDocument();
    expect(screen.getByText("아직 등록된 항목이 없습니다.")).toBeInTheDocument();
  });

  it("icon을 aria-hidden 영역에 렌더링한다", () => {
    render(<EmptyState icon={<span data-testid="empty-icon">아이콘</span>} />);

    expect(screen.getByTestId("empty-icon")).toBeInTheDocument();
  });

  it("action을 렌더링한다", () => {
    render(<EmptyState action={<button type="button">새로 만들기</button>} />);

    expect(
      screen.getByRole("button", {
        name: "새로 만들기",
      }),
    ).toBeInTheDocument();
  });

  it("children을 렌더링한다", () => {
    render(<EmptyState>추가 콘텐츠</EmptyState>);

    expect(screen.getByText("추가 콘텐츠")).toBeInTheDocument();
  });

  it("기본 size와 variant data attribute를 가진다", () => {
    render(<EmptyState heading="비어 있음" />);

    const emptyState = screen.getByText("비어 있음").closest("div");

    expect(emptyState).toHaveAttribute("data-size", "md");
    expect(emptyState).toHaveAttribute("data-variant", "default");
  });

  it("size와 fullWidth primitive prop을 전달한다", () => {
    render(<EmptyState heading="비어 있음" size="lg" fullWidth />);

    const emptyState = screen.getByText("비어 있음").closest("div");

    expect(emptyState).toHaveAttribute("data-size", "lg");
    expect(emptyState).toHaveAttribute("data-full-width", "true");
  });

  it("variant를 적용한다", () => {
    render(<EmptyState heading="비어 있음" variant="muted" />);

    const emptyState = screen.getByText("비어 있음").closest("div");

    expect(emptyState).toHaveAttribute("data-variant", "muted");
  });

  it("className을 병합한다", () => {
    render(<EmptyState heading="비어 있음" className="custom-empty-state" />);

    const emptyState = screen.getByText("비어 있음").closest("div");

    expect(emptyState).toHaveClass("custom-empty-state");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<EmptyState ref={ref} heading="비어 있음" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
