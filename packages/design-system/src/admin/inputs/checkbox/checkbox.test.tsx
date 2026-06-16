import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Checkbox from "./checkbox";

describe("Admin Checkbox", () => {
  it("checkbox input을 렌더링한다", () => {
    render(<Checkbox aria-label="선택" />);

    const checkbox = screen.getByRole("checkbox", { name: "선택" });

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("type", "checkbox");
  });

  it("기본 size는 md이다", () => {
    render(<Checkbox aria-label="선택" />);

    expect(screen.getByRole("checkbox", { name: "선택" })).toHaveAttribute("data-size", "md");
  });

  it("size를 지정할 수 있다", () => {
    render(<Checkbox aria-label="선택" size="lg" />);

    const checkbox = screen.getByRole("checkbox", { name: "선택" });

    expect(checkbox).toHaveAttribute("data-size", "lg");
    expect(checkbox).toHaveClass("size-5");
  });

  it("checked 상태를 제어할 수 있다", () => {
    render(<Checkbox aria-label="선택" checked readOnly />);

    expect(screen.getByRole("checkbox", { name: "선택" })).toBeChecked();
  });

  it("클릭하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox aria-label="선택" onChange={handleChange} />);

    await user.click(screen.getByRole("checkbox", { name: "선택" }));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태를 반영한다", () => {
    render(<Checkbox aria-label="선택" disabled />);

    const checkbox = screen.getByRole("checkbox", { name: "선택" });

    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute("data-disabled", "true");
  });

  it("hasError가 true이면 invalid 상태를 반영한다", () => {
    render(<Checkbox aria-label="선택" hasError />);

    const checkbox = screen.getByRole("checkbox", { name: "선택" });

    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveAttribute("data-invalid", "true");
  });

  it("aria-invalid를 직접 지정하면 해당 값을 우선 사용한다", () => {
    render(<Checkbox aria-label="선택" hasError aria-invalid={false} />);

    const checkbox = screen.getByRole("checkbox", { name: "선택" });

    expect(checkbox).toHaveAttribute("aria-invalid", "false");
    expect(checkbox).toHaveAttribute("data-invalid", "true");
  });

  it("className을 병합한다", () => {
    render(<Checkbox aria-label="선택" className="custom-checkbox" />);

    expect(screen.getByRole("checkbox", { name: "선택" })).toHaveClass("custom-checkbox");
  });
});
