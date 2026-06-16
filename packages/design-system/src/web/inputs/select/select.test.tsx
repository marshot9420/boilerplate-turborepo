import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Select from "./select";

describe("Web Select", () => {
  it("select를 렌더링한다", () => {
    render(
      <Select aria-label="요금제">
        <option value="basic">Basic</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "요금제" })).toBeInTheDocument();
  });

  it("children option을 렌더링한다", () => {
    render(
      <Select aria-label="요금제">
        <option value="basic">Basic</option>
        <option value="pro">Pro</option>
      </Select>,
    );

    expect(screen.getByRole("option", { name: "Basic" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Pro" })).toBeInTheDocument();
  });

  it("기본 size는 md이다", () => {
    render(
      <Select aria-label="요금제">
        <option value="basic">Basic</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "요금제" })).toHaveAttribute("data-size", "md");
  });

  it("size를 지정할 수 있다", () => {
    render(
      <Select aria-label="요금제" size="sm">
        <option value="basic">Basic</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "요금제" });

    expect(select).toHaveAttribute("data-size", "sm");
    expect(select).toHaveClass("h-8");
  });

  it("defaultValue를 반영한다", () => {
    render(
      <Select aria-label="요금제" defaultValue="pro">
        <option value="basic">Basic</option>
        <option value="pro">Pro</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "요금제" })).toHaveValue("pro");
  });

  it("value를 제어할 수 있다", () => {
    render(
      <Select aria-label="요금제" value="basic" onChange={() => {}}>
        <option value="basic">Basic</option>
        <option value="pro">Pro</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "요금제" })).toHaveValue("basic");
  });

  it("옵션을 선택하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Select aria-label="요금제" defaultValue="basic" onChange={handleChange}>
        <option value="basic">Basic</option>
        <option value="pro">Pro</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "요금제" });

    await user.selectOptions(select, "pro");

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(select).toHaveValue("pro");
  });

  it("name 속성을 전달한다", () => {
    render(
      <Select aria-label="요금제" name="plan">
        <option value="basic">Basic</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "요금제" })).toHaveAttribute("name", "plan");
  });

  it("required 속성을 전달한다", () => {
    render(
      <Select aria-label="요금제" required>
        <option value="">선택</option>
        <option value="basic">Basic</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "요금제" })).toBeRequired();
  });

  it("disabled 상태를 반영한다", () => {
    render(
      <Select aria-label="요금제" disabled>
        <option value="basic">Basic</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "요금제" });

    expect(select).toBeDisabled();
    expect(select).toHaveAttribute("data-disabled", "true");
  });

  it("hasError가 true이면 invalid 상태를 반영한다", () => {
    render(
      <Select aria-label="요금제" hasError>
        <option value="basic">Basic</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "요금제" });

    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("data-invalid", "true");
  });

  it("aria-invalid를 직접 지정하면 해당 값을 우선 사용한다", () => {
    render(
      <Select aria-label="요금제" hasError aria-invalid={false}>
        <option value="basic">Basic</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "요금제" });

    expect(select).toHaveAttribute("aria-invalid", "false");
    expect(select).toHaveAttribute("data-invalid", "true");
  });

  it("className을 병합한다", () => {
    render(
      <Select aria-label="요금제" className="custom-select">
        <option value="basic">Basic</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "요금제" })).toHaveClass("custom-select");
  });
});
