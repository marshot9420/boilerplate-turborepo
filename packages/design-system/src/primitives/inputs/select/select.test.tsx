import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRef } from "react";

import Select from "./select";

describe("Select", () => {
  it("select를 렌더링한다", () => {
    render(
      <Select aria-label="상태">
        <option value="draft">초안</option>
        <option value="published">게시</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "상태" })).toBeInTheDocument();
  });

  it("option을 렌더링한다", () => {
    render(
      <Select aria-label="상태">
        <option value="draft">초안</option>
        <option value="published">게시</option>
      </Select>,
    );

    expect(screen.getByRole("option", { name: "초안" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "게시" })).toBeInTheDocument();
  });

  it("className을 병합한다", () => {
    render(
      <Select aria-label="상태" className="custom-select">
        <option value="draft">초안</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "상태" })).toHaveClass("custom-select");
  });

  it("기본 size를 data attribute로 노출한다", () => {
    render(
      <Select aria-label="상태">
        <option value="draft">초안</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "상태" })).toHaveAttribute("data-size", "md");
  });

  it("전달한 size를 data attribute로 노출한다", () => {
    render(
      <Select aria-label="상태" size="lg">
        <option value="draft">초안</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "상태" })).toHaveAttribute("data-size", "lg");
  });

  it("defaultValue를 렌더링한다", () => {
    render(
      <Select aria-label="상태" defaultValue="published">
        <option value="draft">초안</option>
        <option value="published">게시</option>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "상태" })).toHaveValue("published");
  });

  it("값을 선택하면 value가 변경된다", async () => {
    const user = userEvent.setup();

    render(
      <Select aria-label="상태" defaultValue="draft">
        <option value="draft">초안</option>
        <option value="published">게시</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "상태" });

    await user.selectOptions(select, "published");

    expect(select).toHaveValue("published");
  });

  it("change 이벤트를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Select aria-label="상태" defaultValue="draft" onChange={handleChange}>
        <option value="draft">초안</option>
        <option value="published">게시</option>
      </Select>,
    );

    await user.selectOptions(screen.getByRole("combobox", { name: "상태" }), "published");

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태에서는 값을 변경하지 않는다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Select aria-label="상태" defaultValue="draft" disabled onChange={handleChange}>
        <option value="draft">초안</option>
        <option value="published">게시</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "상태" });

    await user.selectOptions(select, "published");

    expect(select).toBeDisabled();
    expect(select).toHaveValue("draft");
    expect(select).toHaveAttribute("data-disabled", "true");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("hasError가 true이면 aria-invalid와 data-invalid를 노출한다", () => {
    render(
      <Select aria-label="상태" hasError>
        <option value="draft">초안</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "상태" });

    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("data-invalid", "true");
  });

  it("hasError가 false이면 invalid 상태를 노출하지 않는다", () => {
    render(
      <Select aria-label="상태">
        <option value="draft">초안</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "상태" });

    expect(select).not.toHaveAttribute("aria-invalid");
    expect(select).toHaveAttribute("data-invalid", "false");
  });

  it("명시적으로 전달한 aria-invalid를 우선 사용한다", () => {
    render(
      <Select aria-label="상태" hasError aria-invalid={false}>
        <option value="draft">초안</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: "상태" });

    expect(select).toHaveAttribute("aria-invalid", "false");
    expect(select).toHaveAttribute("data-invalid", "true");
  });

  it("ref를 select element로 전달한다", () => {
    const ref = createRef<HTMLSelectElement>();

    render(
      <Select ref={ref} aria-label="상태">
        <option value="draft">초안</option>
      </Select>,
    );

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});
