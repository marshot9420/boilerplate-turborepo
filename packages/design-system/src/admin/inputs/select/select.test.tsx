import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Select from "./select";

describe("Admin Select", () => {
  it("select를 렌더링한다", () => {
    render(
      <Select aria-label="상태">
        <option value="published">게시</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "상태" })).toBeInTheDocument();
  });

  it("children option을 렌더링한다", () => {
    render(
      <Select aria-label="상태">
        <option value="published">게시</option>
        <option value="hidden">숨김</option>
      </Select>,
    );

    expect(screen.getByRole("option", { name: "게시" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "숨김" })).toBeInTheDocument();
  });

  it("기본 size는 md이다", () => {
    render(
      <Select aria-label="상태">
        <option value="published">게시</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "상태" })).toHaveAttribute("data-size", "md");
  });

  it("size를 지정할 수 있다", () => {
    render(
      <Select aria-label="상태" size="lg">
        <option value="published">게시</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "상태" });

    expect(select).toHaveAttribute("data-size", "lg");
    expect(select).toHaveClass("h-12");
  });

  it("defaultValue를 반영한다", () => {
    render(
      <Select aria-label="상태" defaultValue="hidden">
        <option value="published">게시</option>
        <option value="hidden">숨김</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "상태" })).toHaveValue("hidden");
  });

  it("value를 제어할 수 있다", () => {
    render(
      <Select aria-label="상태" value="published" onChange={() => {}}>
        <option value="published">게시</option>
        <option value="hidden">숨김</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "상태" })).toHaveValue("published");
  });

  it("옵션을 선택하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Select aria-label="상태" defaultValue="published" onChange={handleChange}>
        <option value="published">게시</option>
        <option value="hidden">숨김</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "상태" });

    await user.selectOptions(select, "hidden");

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(select).toHaveValue("hidden");
  });

  it("name 속성을 전달한다", () => {
    render(
      <Select aria-label="상태" name="status">
        <option value="published">게시</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "상태" })).toHaveAttribute("name", "status");
  });

  it("required 속성을 전달한다", () => {
    render(
      <Select aria-label="상태" required>
        <option value="">선택</option>
        <option value="published">게시</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "상태" })).toBeRequired();
  });

  it("disabled 상태를 반영한다", () => {
    render(
      <Select aria-label="상태" disabled>
        <option value="published">게시</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "상태" });

    expect(select).toBeDisabled();
    expect(select).toHaveAttribute("data-disabled", "true");
  });

  it("hasError가 true이면 invalid 상태를 반영한다", () => {
    render(
      <Select aria-label="상태" hasError>
        <option value="published">게시</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "상태" });

    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("data-invalid", "true");
  });

  it("aria-invalid를 직접 지정하면 해당 값을 우선 사용한다", () => {
    render(
      <Select aria-label="상태" hasError aria-invalid={false}>
        <option value="published">게시</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "상태" });

    expect(select).toHaveAttribute("aria-invalid", "false");
    expect(select).toHaveAttribute("data-invalid", "true");
  });

  it("className을 병합한다", () => {
    render(
      <Select aria-label="상태" className="custom-select">
        <option value="published">게시</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "상태" })).toHaveClass("custom-select");
  });
});
