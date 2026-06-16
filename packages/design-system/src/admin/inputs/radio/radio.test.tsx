import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Radio from "./radio";

describe("Admin Radio", () => {
  it("radio input을 렌더링한다", () => {
    render(<Radio aria-label="옵션 A" />);

    const radio = screen.getByRole("radio", { name: "옵션 A" });

    expect(radio).toBeInTheDocument();
    expect(radio).toHaveAttribute("type", "radio");
  });

  it("기본 size는 md이다", () => {
    render(<Radio aria-label="옵션 A" />);

    expect(screen.getByRole("radio", { name: "옵션 A" })).toHaveAttribute("data-size", "md");
  });

  it("size를 지정할 수 있다", () => {
    render(<Radio aria-label="옵션 A" size="lg" />);

    const radio = screen.getByRole("radio", { name: "옵션 A" });

    expect(radio).toHaveAttribute("data-size", "lg");
    expect(radio).toHaveClass("size-5");
  });

  it("checked 상태를 제어할 수 있다", () => {
    render(<Radio aria-label="옵션 A" checked readOnly />);

    expect(screen.getByRole("radio", { name: "옵션 A" })).toBeChecked();
  });

  it("defaultChecked 상태를 반영한다", () => {
    render(<Radio aria-label="옵션 A" defaultChecked />);

    expect(screen.getByRole("radio", { name: "옵션 A" })).toBeChecked();
  });

  it("클릭하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Radio aria-label="옵션 A" onChange={handleChange} />);

    const radio = screen.getByRole("radio", { name: "옵션 A" });

    await user.click(radio);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(radio).toBeChecked();
  });

  it("같은 name을 가진 radio 그룹에서 하나만 선택된다", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Radio aria-label="옵션 A" name="option" value="a" defaultChecked />
        <Radio aria-label="옵션 B" name="option" value="b" />
      </div>,
    );

    const firstRadio = screen.getByRole("radio", { name: "옵션 A" });
    const secondRadio = screen.getByRole("radio", { name: "옵션 B" });

    expect(firstRadio).toBeChecked();
    expect(secondRadio).not.toBeChecked();

    await user.click(secondRadio);

    expect(firstRadio).not.toBeChecked();
    expect(secondRadio).toBeChecked();
  });

  it("name과 value 속성을 전달한다", () => {
    render(<Radio aria-label="옵션 A" name="status" value="active" />);

    const radio = screen.getByRole("radio", { name: "옵션 A" });

    expect(radio).toHaveAttribute("name", "status");
    expect(radio).toHaveAttribute("value", "active");
  });

  it("disabled 상태를 반영한다", () => {
    render(<Radio aria-label="옵션 A" disabled />);

    const radio = screen.getByRole("radio", { name: "옵션 A" });

    expect(radio).toBeDisabled();
    expect(radio).toHaveAttribute("data-disabled", "true");
  });

  it("hasError가 true이면 invalid 상태를 반영한다", () => {
    render(<Radio aria-label="옵션 A" hasError />);

    const radio = screen.getByRole("radio", { name: "옵션 A" });

    expect(radio).toHaveAttribute("aria-invalid", "true");
    expect(radio).toHaveAttribute("data-invalid", "true");
  });

  it("aria-invalid를 직접 지정하면 해당 값을 우선 사용한다", () => {
    render(<Radio aria-label="옵션 A" hasError aria-invalid={false} />);

    const radio = screen.getByRole("radio", { name: "옵션 A" });

    expect(radio).toHaveAttribute("aria-invalid", "false");
    expect(radio).toHaveAttribute("data-invalid", "true");
  });

  it("className을 병합한다", () => {
    render(<Radio aria-label="옵션 A" className="custom-radio" />);

    expect(screen.getByRole("radio", { name: "옵션 A" })).toHaveClass("custom-radio");
  });
});
