import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import NumberInput from "./number-input";

describe("Web NumberInput", () => {
  it("number input을 렌더링한다", () => {
    render(<NumberInput aria-label="가격" />);

    const input = screen.getByRole("spinbutton", { name: "가격" });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "number");
  });

  it("기본 size는 md이다", () => {
    render(<NumberInput aria-label="가격" />);

    expect(screen.getByRole("spinbutton", { name: "가격" })).toHaveAttribute("data-size", "md");
  });

  it("size를 지정할 수 있다", () => {
    render(<NumberInput aria-label="가격" size="sm" />);

    const input = screen.getByRole("spinbutton", { name: "가격" });

    expect(input).toHaveAttribute("data-size", "sm");
    expect(input).toHaveClass("h-8");
  });

  it("inputMode 기본값은 decimal이다", () => {
    render(<NumberInput aria-label="가격" />);

    expect(screen.getByRole("spinbutton", { name: "가격" })).toHaveAttribute(
      "inputmode",
      "decimal",
    );
  });

  it("inputMode를 직접 지정할 수 있다", () => {
    render(<NumberInput aria-label="수량" inputMode="numeric" />);

    expect(screen.getByRole("spinbutton", { name: "수량" })).toHaveAttribute(
      "inputmode",
      "numeric",
    );
  });

  it("min, max, step 속성을 전달한다", () => {
    render(<NumberInput aria-label="수량" min={1} max={10} step={1} />);

    const input = screen.getByRole("spinbutton", { name: "수량" });

    expect(input).toHaveAttribute("min", "1");
    expect(input).toHaveAttribute("max", "10");
    expect(input).toHaveAttribute("step", "1");
  });

  it("placeholder를 전달한다", () => {
    render(<NumberInput aria-label="가격" placeholder="가격을 입력해 주세요." />);

    expect(screen.getByRole("spinbutton", { name: "가격" })).toHaveAttribute(
      "placeholder",
      "가격을 입력해 주세요.",
    );
  });

  it("value를 제어할 수 있다", () => {
    render(<NumberInput aria-label="가격" value={10000} readOnly />);

    expect(screen.getByRole("spinbutton", { name: "가격" })).toHaveValue(10000);
  });

  it("입력하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<NumberInput aria-label="가격" onChange={handleChange} />);

    const input = screen.getByRole("spinbutton", { name: "가격" });

    await user.type(input, "123");

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue(123);
  });

  it("disabled 상태를 반영한다", () => {
    render(<NumberInput aria-label="가격" disabled />);

    const input = screen.getByRole("spinbutton", { name: "가격" });

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("data-disabled", "true");
  });

  it("hasError가 true이면 invalid 상태를 반영한다", () => {
    render(<NumberInput aria-label="가격" hasError />);

    const input = screen.getByRole("spinbutton", { name: "가격" });

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("aria-invalid를 직접 지정하면 해당 값을 우선 사용한다", () => {
    render(<NumberInput aria-label="가격" hasError aria-invalid={false} />);

    const input = screen.getByRole("spinbutton", { name: "가격" });

    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("name 속성을 전달한다", () => {
    render(<NumberInput aria-label="가격" name="price" />);

    expect(screen.getByRole("spinbutton", { name: "가격" })).toHaveAttribute("name", "price");
  });

  it("className을 병합한다", () => {
    render(<NumberInput aria-label="가격" className="custom-number-input" />);

    expect(screen.getByRole("spinbutton", { name: "가격" })).toHaveClass("custom-number-input");
  });
});
