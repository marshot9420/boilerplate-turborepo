import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import Label from "./label";

describe("Label", () => {
  it("children을 렌더링한다", () => {
    render(<Label>이메일</Label>);

    expect(screen.getByText("이메일")).toBeInTheDocument();
  });

  it("htmlFor를 label element에 전달한다", () => {
    render(<Label htmlFor="email">이메일</Label>);

    const label = screen.getByText("이메일");

    expect(label).toHaveAttribute("for", "email");
  });

  it("className을 병합한다", () => {
    render(<Label className="custom-label">이메일</Label>);

    const label = screen.getByText("이메일");

    expect(label).toHaveClass("custom-label");
  });

  it("required가 true이면 필수 표시를 렌더링한다", () => {
    render(<Label required>이메일</Label>);

    const label = screen.getByText("이메일");
    const requiredMark = screen.getByText("*");

    expect(label).toHaveAttribute("data-required", "true");
    expect(requiredMark).toBeInTheDocument();
    expect(requiredMark).toHaveAttribute("aria-hidden", "true");
  });

  it("required가 false이면 필수 표시를 렌더링하지 않는다", () => {
    render(<Label>이메일</Label>);

    const label = screen.getByText("이메일");

    expect(label).toHaveAttribute("data-required", "false");
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("requiredSlot을 사용해 필수 표시를 변경할 수 있다", () => {
    render(
      <Label required requiredSlot="필수">
        이메일
      </Label>,
    );

    expect(screen.getByText("필수")).toBeInTheDocument();
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("disabled 상태를 data attribute로 노출한다", () => {
    render(<Label disabled>이메일</Label>);

    const label = screen.getByText("이메일");

    expect(label).toHaveAttribute("data-disabled", "true");
  });

  it("기본 disabled 상태는 false다", () => {
    render(<Label>이메일</Label>);

    const label = screen.getByText("이메일");

    expect(label).toHaveAttribute("data-disabled", "false");
  });

  it("ref를 label element로 전달한다", () => {
    const ref = createRef<HTMLLabelElement>();

    render(<Label ref={ref}>이메일</Label>);

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current).toHaveTextContent("이메일");
  });
});
