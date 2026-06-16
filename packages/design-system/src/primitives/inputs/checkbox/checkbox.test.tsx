import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRef } from "react";

import Checkbox from "./checkbox";

describe("Checkbox", () => {
  it("checkbox를 렌더링한다", () => {
    render(<Checkbox aria-label="약관 동의" />);

    expect(screen.getByRole("checkbox", { name: "약관 동의" })).toBeInTheDocument();
  });

  it("type은 checkbox다", () => {
    render(<Checkbox aria-label="약관 동의" />);

    expect(screen.getByRole("checkbox", { name: "약관 동의" })).toHaveAttribute("type", "checkbox");
  });

  it("className을 병합한다", () => {
    render(<Checkbox aria-label="약관 동의" className="custom-checkbox" />);

    expect(screen.getByRole("checkbox", { name: "약관 동의" })).toHaveClass("custom-checkbox");
  });

  it("기본 size를 data attribute로 노출한다", () => {
    render(<Checkbox aria-label="약관 동의" />);

    expect(screen.getByRole("checkbox", { name: "약관 동의" })).toHaveAttribute("data-size", "md");
  });

  it("전달한 size를 data attribute로 노출한다", () => {
    render(<Checkbox aria-label="약관 동의" size="lg" />);

    expect(screen.getByRole("checkbox", { name: "약관 동의" })).toHaveAttribute("data-size", "lg");
  });

  it("defaultChecked를 렌더링한다", () => {
    render(<Checkbox aria-label="약관 동의" defaultChecked />);

    expect(screen.getByRole("checkbox", { name: "약관 동의" })).toBeChecked();
  });

  it("클릭하면 checked 상태가 변경된다", async () => {
    const user = userEvent.setup();

    render(<Checkbox aria-label="약관 동의" />);

    const checkbox = screen.getByRole("checkbox", { name: "약관 동의" });

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("change 이벤트를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox aria-label="약관 동의" onChange={handleChange} />);

    await user.click(screen.getByRole("checkbox", { name: "약관 동의" }));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태에서는 변경되지 않는다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox aria-label="약관 동의" disabled onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox", { name: "약관 동의" });

    await user.click(checkbox);

    expect(checkbox).toBeDisabled();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute("data-disabled", "true");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("hasError가 true이면 aria-invalid와 data-invalid를 노출한다", () => {
    render(<Checkbox aria-label="약관 동의" hasError />);

    const checkbox = screen.getByRole("checkbox", { name: "약관 동의" });

    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveAttribute("data-invalid", "true");
  });

  it("명시적으로 전달한 aria-invalid를 우선 사용한다", () => {
    render(<Checkbox aria-label="약관 동의" hasError aria-invalid={false} />);

    const checkbox = screen.getByRole("checkbox", { name: "약관 동의" });

    expect(checkbox).toHaveAttribute("aria-invalid", "false");
    expect(checkbox).toHaveAttribute("data-invalid", "true");
  });

  it("ref를 input element로 전달한다", () => {
    const ref = createRef<HTMLInputElement>();

    render(<Checkbox ref={ref} aria-label="약관 동의" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
