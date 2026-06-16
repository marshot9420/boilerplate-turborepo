import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRef } from "react";

import NumberInput from "./number-input";

describe("NumberInput", () => {
  it("number input을 렌더링한다", () => {
    render(<NumberInput aria-label="수량" />);

    expect(screen.getByRole("spinbutton", { name: "수량" })).toBeInTheDocument();
  });

  it("type은 number다", () => {
    render(<NumberInput aria-label="수량" />);

    expect(screen.getByRole("spinbutton", { name: "수량" })).toHaveAttribute("type", "number");
  });

  it("기본 inputMode는 decimal이다", () => {
    render(<NumberInput aria-label="수량" />);

    expect(screen.getByRole("spinbutton", { name: "수량" })).toHaveAttribute(
      "inputmode",
      "decimal",
    );
  });

  it("전달한 inputMode를 우선 사용한다", () => {
    render(<NumberInput aria-label="수량" inputMode="numeric" />);

    expect(screen.getByRole("spinbutton", { name: "수량" })).toHaveAttribute(
      "inputmode",
      "numeric",
    );
  });

  it("min, max, step을 전달한다", () => {
    render(<NumberInput aria-label="수량" min={1} max={10} step={1} />);

    const input = screen.getByRole("spinbutton", { name: "수량" });

    expect(input).toHaveAttribute("min", "1");
    expect(input).toHaveAttribute("max", "10");
    expect(input).toHaveAttribute("step", "1");
  });

  it("className을 병합한다", () => {
    render(<NumberInput aria-label="수량" className="custom-number-input" />);

    expect(screen.getByRole("spinbutton", { name: "수량" })).toHaveClass("custom-number-input");
  });

  it("기본 size를 data attribute로 노출한다", () => {
    render(<NumberInput aria-label="수량" />);

    expect(screen.getByRole("spinbutton", { name: "수량" })).toHaveAttribute("data-size", "md");
  });

  it("전달한 size를 data attribute로 노출한다", () => {
    render(<NumberInput aria-label="수량" size="lg" />);

    expect(screen.getByRole("spinbutton", { name: "수량" })).toHaveAttribute("data-size", "lg");
  });

  it("defaultValue를 렌더링한다", () => {
    render(<NumberInput aria-label="수량" defaultValue={3} />);

    expect(screen.getByRole("spinbutton", { name: "수량" })).toHaveValue(3);
  });

  it("입력 이벤트를 처리한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<NumberInput aria-label="수량" onChange={handleChange} />);

    const input = screen.getByRole("spinbutton", { name: "수량" });

    await user.type(input, "123");

    expect(input).toHaveValue(123);
    expect(handleChange).toHaveBeenCalled();
  });

  it("disabled 상태에서는 입력되지 않는다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<NumberInput aria-label="수량" disabled onChange={handleChange} />);

    const input = screen.getByRole("spinbutton", { name: "수량" });

    await user.type(input, "123");

    expect(input).toBeDisabled();
    expect(input).toHaveValue(null);
    expect(input).toHaveAttribute("data-disabled", "true");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("hasError가 true이면 aria-invalid와 data-invalid를 노출한다", () => {
    render(<NumberInput aria-label="수량" hasError />);

    const input = screen.getByRole("spinbutton", { name: "수량" });

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("hasError가 false이면 invalid 상태를 노출하지 않는다", () => {
    render(<NumberInput aria-label="수량" />);

    const input = screen.getByRole("spinbutton", { name: "수량" });

    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).toHaveAttribute("data-invalid", "false");
  });

  it("명시적으로 전달한 aria-invalid를 우선 사용한다", () => {
    render(<NumberInput aria-label="수량" hasError aria-invalid={false} />);

    const input = screen.getByRole("spinbutton", { name: "수량" });

    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("ref를 input element로 전달한다", () => {
    const ref = createRef<HTMLInputElement>();

    render(<NumberInput ref={ref} aria-label="수량" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
