import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import FieldLabel from "./field-label";

describe("Admin FieldLabel", () => {
  it("children을 렌더링한다", () => {
    render(<FieldLabel>제목</FieldLabel>);

    expect(screen.getByText("제목")).toBeInTheDocument();
  });

  it("htmlFor를 전달한다", () => {
    render(<FieldLabel htmlFor="title">제목</FieldLabel>);

    expect(screen.getByText("제목")).toHaveAttribute("for", "title");
  });

  it("기본 data attribute를 가진다", () => {
    render(<FieldLabel>제목</FieldLabel>);

    const label = screen.getByText("제목");

    expect(label).toHaveAttribute("data-size", "md");
    expect(label).toHaveAttribute("data-weight", "medium");
    expect(label).toHaveAttribute("data-required", "false");
    expect(label).toHaveAttribute("data-disabled", "false");
    expect(label).toHaveAttribute("data-invalid", "false");
  });

  it("hasError 상태를 적용한다", () => {
    render(<FieldLabel hasError>제목</FieldLabel>);

    const label = screen.getByText("제목");

    expect(label).toHaveAttribute("data-invalid", "true");
    expect(label).toHaveClass("data-[invalid=true]:text-destructive");
  });

  it("required 표시를 렌더링한다", () => {
    const { container } = render(<FieldLabel required>제목</FieldLabel>);

    const label = container.querySelector("label");
    const requiredMark = container.querySelector("span[aria-hidden='true']");

    expect(label).toHaveAttribute("data-required", "true");
    expect(requiredMark).toHaveTextContent("*");
  });

  it("requiredSlot을 덮어쓸 수 있다", () => {
    render(
      <FieldLabel required requiredSlot="필수">
        제목
      </FieldLabel>,
    );

    expect(screen.getByText("필수")).toBeInTheDocument();
  });

  it("disabled 상태를 적용한다", () => {
    render(<FieldLabel disabled>제목</FieldLabel>);

    const label = screen.getByText("제목");

    expect(label).toHaveAttribute("data-disabled", "true");
    expect(label).toHaveClass("data-[disabled=true]:cursor-not-allowed");
  });

  it("size를 적용한다", () => {
    render(<FieldLabel size="sm">제목</FieldLabel>);

    const label = screen.getByText("제목");

    expect(label).toHaveAttribute("data-size", "sm");
    expect(label).toHaveClass("text-xs");
  });

  it("weight를 적용한다", () => {
    render(<FieldLabel weight="semibold">제목</FieldLabel>);

    const label = screen.getByText("제목");

    expect(label).toHaveAttribute("data-weight", "semibold");
    expect(label).toHaveClass("font-semibold");
  });

  it("className을 병합한다", () => {
    render(<FieldLabel className="custom-label">제목</FieldLabel>);

    expect(screen.getByText("제목")).toHaveClass("custom-label");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLLabelElement>();

    render(<FieldLabel ref={ref}>제목</FieldLabel>);

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });
});
