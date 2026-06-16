import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import EmptyState from "./empty-state";

describe("Web EmptyState", () => {
  it("heading과 description을 렌더링한다", () => {
    render(<EmptyState heading="콘텐츠가 없습니다" description="아직 표시할 콘텐츠가 없습니다." />);

    expect(screen.getByText("콘텐츠가 없습니다")).toBeInTheDocument();
    expect(screen.getByText("아직 표시할 콘텐츠가 없습니다.")).toBeInTheDocument();
  });

  it("icon을 렌더링한다", () => {
    render(<EmptyState icon={<span data-testid="empty-icon">아이콘</span>} />);

    expect(screen.getByTestId("empty-icon")).toBeInTheDocument();
  });

  it("action을 렌더링한다", () => {
    render(<EmptyState action={<button type="button">다시 시도</button>} />);

    expect(
      screen.getByRole("button", {
        name: "다시 시도",
      }),
    ).toBeInTheDocument();
  });

  it("children을 렌더링한다", () => {
    render(<EmptyState>추가 안내</EmptyState>);

    expect(screen.getByText("추가 안내")).toBeInTheDocument();
  });

  it("기본 size와 variant data attribute를 가진다", () => {
    render(<EmptyState heading="비어 있음" />);

    const emptyState = screen.getByText("비어 있음").closest("div");

    expect(emptyState).toHaveAttribute("data-size", "md");
    expect(emptyState).toHaveAttribute("data-variant", "default");
  });

  it("size와 fullWidth primitive prop을 전달한다", () => {
    render(<EmptyState heading="비어 있음" size="sm" fullWidth />);

    const emptyState = screen.getByText("비어 있음").closest("div");

    expect(emptyState).toHaveAttribute("data-size", "sm");
    expect(emptyState).toHaveAttribute("data-full-width", "true");
  });

  it("variant를 적용한다", () => {
    render(<EmptyState heading="비어 있음" variant="surface" />);

    const emptyState = screen.getByText("비어 있음").closest("div");

    expect(emptyState).toHaveAttribute("data-variant", "surface");
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
