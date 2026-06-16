import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import FieldLabel from "./field-label";

describe("Web FieldLabel", () => {
  it("children을 렌더링한다", () => {
    render(<FieldLabel>닉네임</FieldLabel>);

    expect(screen.getByText("닉네임")).toBeInTheDocument();
  });

  it("htmlFor를 전달한다", () => {
    render(<FieldLabel htmlFor="nickname">닉네임</FieldLabel>);

    expect(screen.getByText("닉네임")).toHaveAttribute("for", "nickname");
  });

  it("기본 data attribute를 가진다", () => {
    render(<FieldLabel>닉네임</FieldLabel>);

    const label = screen.getByText("닉네임");

    expect(label).toHaveAttribute("data-size", "md");
    expect(label).toHaveAttribute("data-weight", "medium");
    expect(label).toHaveAttribute("data-required", "false");
    expect(label).toHaveAttribute("data-disabled", "false");
    expect(label).toHaveAttribute("data-invalid", "false");
  });

  it("hasError 상태를 적용한다", () => {
    render(<FieldLabel hasError>닉네임</FieldLabel>);

    const label = screen.getByText("닉네임");

    expect(label).toHaveAttribute("data-invalid", "true");
    expect(label).toHaveClass("data-[invalid=true]:text-destructive");
  });

  it("required 표시를 렌더링한다", () => {
    const { container } = render(<FieldLabel required>닉네임</FieldLabel>);

    const label = container.querySelector("label");
    const requiredMark = container.querySelector("span[aria-hidden='true']");

    expect(label).toHaveAttribute("data-required", "true");
    expect(requiredMark).toHaveTextContent("*");
  });

  it("requiredSlot을 덮어쓸 수 있다", () => {
    render(
      <FieldLabel required requiredSlot="필수">
        닉네임
      </FieldLabel>,
    );

    expect(screen.getByText("필수")).toBeInTheDocument();
  });

  it("disabled 상태를 적용한다", () => {
    render(<FieldLabel disabled>닉네임</FieldLabel>);

    const label = screen.getByText("닉네임");

    expect(label).toHaveAttribute("data-disabled", "true");
    expect(label).toHaveClass("data-[disabled=true]:cursor-not-allowed");
  });

  it("size를 적용한다", () => {
    render(<FieldLabel size="sm">닉네임</FieldLabel>);

    const label = screen.getByText("닉네임");

    expect(label).toHaveAttribute("data-size", "sm");
    expect(label).toHaveClass("text-xs");
  });

  it("weight를 적용한다", () => {
    render(<FieldLabel weight="semibold">닉네임</FieldLabel>);

    const label = screen.getByText("닉네임");

    expect(label).toHaveAttribute("data-weight", "semibold");
    expect(label).toHaveClass("font-semibold");
  });

  it("className을 병합한다", () => {
    render(<FieldLabel className="custom-label">닉네임</FieldLabel>);

    expect(screen.getByText("닉네임")).toHaveClass("custom-label");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLLabelElement>();

    render(<FieldLabel ref={ref}>닉네임</FieldLabel>);

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });
});
