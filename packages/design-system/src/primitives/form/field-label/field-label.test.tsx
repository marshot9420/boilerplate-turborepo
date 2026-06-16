import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import FieldLabel from "./field-label";

describe("FieldLabel", () => {
  it("children을 렌더링한다", () => {
    render(<FieldLabel>이메일</FieldLabel>);

    expect(screen.getByText("이메일")).toBeInTheDocument();
  });

  it("htmlFor를 label element에 전달한다", () => {
    render(<FieldLabel htmlFor="email">이메일</FieldLabel>);

    expect(screen.getByText("이메일")).toHaveAttribute("for", "email");
  });

  it("required 상태를 렌더링한다", () => {
    render(<FieldLabel required>이메일</FieldLabel>);

    expect(screen.getByText("이메일")).toHaveAttribute("data-required", "true");
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("hasError가 true이면 data-invalid를 노출한다", () => {
    render(<FieldLabel hasError>이메일</FieldLabel>);

    expect(screen.getByText("이메일")).toHaveAttribute("data-invalid", "true");
  });

  it("className을 병합한다", () => {
    render(<FieldLabel className="custom-label">이메일</FieldLabel>);

    expect(screen.getByText("이메일")).toHaveClass("custom-label");
  });

  it("ref를 label element로 전달한다", () => {
    const ref = createRef<HTMLLabelElement>();

    render(<FieldLabel ref={ref}>이메일</FieldLabel>);

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });
});
