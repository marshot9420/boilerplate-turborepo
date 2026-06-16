import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import FieldLabel from "./field-label";

describe("FieldLabel", () => {
  it("children을 렌더링한다", () => {
    render(<FieldLabel>이름</FieldLabel>);

    expect(screen.getByText("이름")).toBeInTheDocument();
  });

  it("htmlFor를 전달한다", () => {
    render(<FieldLabel htmlFor="name">이름</FieldLabel>);

    expect(screen.getByText("이름")).toHaveAttribute("for", "name");
  });

  it("기본 data attribute를 가진다", () => {
    render(<FieldLabel>이름</FieldLabel>);

    const label = screen.getByText("이름");

    expect(label).toHaveAttribute("data-invalid", "false");
    expect(label).toHaveAttribute("data-required", "false");
    expect(label).toHaveAttribute("data-disabled", "false");
  });

  it("hasError 상태를 적용한다", () => {
    render(<FieldLabel hasError>이름</FieldLabel>);

    const label = screen.getByText("이름");

    expect(label).toHaveAttribute("data-invalid", "true");
    expect(label).toHaveClass("data-[invalid=true]:text-destructive");
  });

  it("required 표시를 렌더링한다", () => {
    const { container } = render(<FieldLabel required>이름</FieldLabel>);

    const label = container.querySelector("label");
    const requiredMark = container.querySelector("span[aria-hidden='true']");

    expect(label).toHaveAttribute("data-required", "true");
    expect(requiredMark).toHaveTextContent("*");
    expect(requiredMark).toHaveClass("text-destructive");
  });

  it("requiredSlot을 렌더링한다", () => {
    render(
      <FieldLabel required requiredSlot="필수">
        이름
      </FieldLabel>,
    );

    expect(screen.getByText("필수")).toBeInTheDocument();
  });

  it("disabled 상태를 적용한다", () => {
    render(<FieldLabel disabled>이름</FieldLabel>);

    const label = screen.getByText("이름");

    expect(label).toHaveAttribute("data-disabled", "true");
    expect(label).toHaveClass("data-[disabled=true]:cursor-not-allowed");
    expect(label).toHaveClass("data-[disabled=true]:opacity-50");
  });

  it("className을 병합한다", () => {
    render(<FieldLabel className="custom-label">이름</FieldLabel>);

    expect(screen.getByText("이름")).toHaveClass("custom-label");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLLabelElement>();

    render(<FieldLabel ref={ref}>이름</FieldLabel>);

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });
});
