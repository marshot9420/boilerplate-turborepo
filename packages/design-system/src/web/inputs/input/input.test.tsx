import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Input from "./input";

describe("Web Input", () => {
  it("input을 렌더링한다", () => {
    render(<Input aria-label="이메일" />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toBeInTheDocument();
  });

  it("기본 size는 md이다", () => {
    render(<Input aria-label="이메일" />);

    expect(screen.getByRole("textbox", { name: "이메일" })).toHaveAttribute("data-size", "md");
  });

  it("size를 지정할 수 있다", () => {
    render(<Input aria-label="이메일" size="sm" />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toHaveAttribute("data-size", "sm");
    expect(input).toHaveClass("h-8");
  });

  it("type과 placeholder를 전달한다", () => {
    render(<Input aria-label="이메일" type="email" placeholder="email@example.com" />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "email@example.com");
  });

  it("value를 제어할 수 있다", () => {
    render(<Input aria-label="이메일" value="user@example.com" readOnly />);

    expect(screen.getByRole("textbox", { name: "이메일" })).toHaveValue("user@example.com");
  });

  it("입력하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input aria-label="이메일" onChange={handleChange} />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    await user.type(input, "hello");

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue("hello");
  });

  it("disabled 상태를 반영한다", () => {
    render(<Input aria-label="이메일" disabled />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("data-disabled", "true");
  });

  it("hasError가 true이면 invalid 상태를 반영한다", () => {
    render(<Input aria-label="이메일" hasError />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("aria-invalid를 직접 지정하면 해당 값을 우선 사용한다", () => {
    render(<Input aria-label="이메일" hasError aria-invalid={false} />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("name과 autoComplete 속성을 전달한다", () => {
    render(<Input aria-label="이메일" name="email" autoComplete="email" />);

    const input = screen.getByRole("textbox", { name: "이메일" });

    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("autocomplete", "email");
  });

  it("className을 병합한다", () => {
    render(<Input aria-label="이메일" className="custom-input" />);

    expect(screen.getByRole("textbox", { name: "이메일" })).toHaveClass("custom-input");
  });
});
