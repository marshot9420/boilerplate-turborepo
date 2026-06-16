import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRef } from "react";

import Radio from "./radio";

describe("Radio", () => {
  it("radio를 렌더링한다", () => {
    render(<Radio aria-label="옵션 A" name="option" value="A" />);

    expect(screen.getByRole("radio", { name: "옵션 A" })).toBeInTheDocument();
  });

  it("type은 radio다", () => {
    render(<Radio aria-label="옵션 A" name="option" value="A" />);

    expect(screen.getByRole("radio", { name: "옵션 A" })).toHaveAttribute(
      "type",
      "radio",
    );
  });

  it("className을 병합한다", () => {
    render(
      <Radio
        aria-label="옵션 A"
        name="option"
        value="A"
        className="custom-radio"
      />,
    );

    expect(screen.getByRole("radio", { name: "옵션 A" })).toHaveClass(
      "custom-radio",
    );
  });

  it("기본 size를 data attribute로 노출한다", () => {
    render(<Radio aria-label="옵션 A" name="option" value="A" />);

    expect(screen.getByRole("radio", { name: "옵션 A" })).toHaveAttribute(
      "data-size",
      "md",
    );
  });

  it("전달한 size를 data attribute로 노출한다", () => {
    render(<Radio aria-label="옵션 A" name="option" value="A" size="lg" />);

    expect(screen.getByRole("radio", { name: "옵션 A" })).toHaveAttribute(
      "data-size",
      "lg",
    );
  });

  it("defaultChecked를 렌더링한다", () => {
    render(
      <Radio aria-label="옵션 A" name="option" value="A" defaultChecked />,
    );

    expect(screen.getByRole("radio", { name: "옵션 A" })).toBeChecked();
  });

  it("같은 name의 radio 중 하나만 선택된다", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Radio aria-label="옵션 A" name="option" value="A" />
        <Radio aria-label="옵션 B" name="option" value="B" />
      </>,
    );

    const optionA = screen.getByRole("radio", { name: "옵션 A" });
    const optionB = screen.getByRole("radio", { name: "옵션 B" });

    await user.click(optionA);

    expect(optionA).toBeChecked();
    expect(optionB).not.toBeChecked();

    await user.click(optionB);

    expect(optionA).not.toBeChecked();
    expect(optionB).toBeChecked();
  });

  it("change 이벤트를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Radio
        aria-label="옵션 A"
        name="option"
        value="A"
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "옵션 A" }));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태에서는 변경되지 않는다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Radio
        aria-label="옵션 A"
        name="option"
        value="A"
        disabled
        onChange={handleChange}
      />,
    );

    const radio = screen.getByRole("radio", { name: "옵션 A" });

    await user.click(radio);

    expect(radio).toBeDisabled();
    expect(radio).not.toBeChecked();
    expect(radio).toHaveAttribute("data-disabled", "true");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("hasError가 true이면 aria-invalid와 data-invalid를 노출한다", () => {
    render(<Radio aria-label="옵션 A" name="option" value="A" hasError />);

    const radio = screen.getByRole("radio", { name: "옵션 A" });

    expect(radio).toHaveAttribute("aria-invalid", "true");
    expect(radio).toHaveAttribute("data-invalid", "true");
  });

  it("명시적으로 전달한 aria-invalid를 우선 사용한다", () => {
    render(
      <Radio
        aria-label="옵션 A"
        name="option"
        value="A"
        hasError
        aria-invalid={false}
      />,
    );

    const radio = screen.getByRole("radio", { name: "옵션 A" });

    expect(radio).toHaveAttribute("aria-invalid", "false");
    expect(radio).toHaveAttribute("data-invalid", "true");
  });

  it("ref를 input element로 전달한다", () => {
    const ref = createRef<HTMLInputElement>();

    render(<Radio ref={ref} aria-label="옵션 A" name="option" value="A" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
