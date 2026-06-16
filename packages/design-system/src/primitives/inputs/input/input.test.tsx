import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRef } from "react";

import Input from "./input";

describe("Input", () => {
  it("input을 렌더링한다", () => {
    render(<Input aria-label="이메일" />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toBeInTheDocument();
  });

  it("className을 병합한다", () => {
    render(<Input aria-label="이메일" className="custom-input" />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toHaveClass("custom-input");
  });

  it("기본 size를 data attribute로 노출한다", () => {
    render(<Input aria-label="이메일" />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toHaveAttribute("data-size", "md");
  });

  it("전달한 size를 data attribute로 노출한다", () => {
    render(<Input aria-label="이메일" size="lg" />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toHaveAttribute("data-size", "lg");
  });

  it("placeholder를 렌더링한다", () => {
    render(<Input aria-label="이메일" placeholder="이메일을 입력해 주세요" />);

    expect(screen.getByPlaceholderText("이메일을 입력해 주세요")).toBeInTheDocument();
  });

  it("defaultValue를 렌더링한다", () => {
    render(<Input aria-label="이메일" defaultValue="test@example.com" />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toHaveValue("test@example.com");
  });

  it("입력 이벤트를 처리한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input aria-label="이메일" onChange={handleChange} />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    await user.type(input, "test@example.com");

    expect(input).toHaveValue("test@example.com");
    expect(handleChange).toHaveBeenCalled();
  });

  it("disabled가 true이면 비활성화 상태를 노출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input aria-label="이메일" disabled onChange={handleChange} />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    await user.type(input, "test@example.com");

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("data-disabled", "true");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("hasError가 true이면 aria-invalid와 data-invalid를 노출한다", () => {
    render(<Input aria-label="이메일" hasError />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("hasError가 false이면 invalid 상태를 노출하지 않는다", () => {
    render(<Input aria-label="이메일" />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).toHaveAttribute("data-invalid", "false");
  });

  it("명시적으로 전달한 aria-invalid를 우선 사용한다", () => {
    render(<Input aria-label="이메일" hasError aria-invalid={false} />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("ref를 input element로 전달한다", () => {
    const ref = createRef<HTMLInputElement>();

    render(<Input ref={ref} aria-label="이메일" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
