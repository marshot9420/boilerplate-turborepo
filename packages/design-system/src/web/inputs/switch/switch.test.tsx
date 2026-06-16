import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Switch from "./switch";

describe("Web Switch", () => {
  it("switch input을 렌더링한다", () => {
    render(<Switch aria-label="마케팅 수신" />);

    const switchInput = screen.getByRole("switch", { name: "마케팅 수신" });

    expect(switchInput).toBeInTheDocument();
    expect(switchInput).toHaveAttribute("type", "checkbox");
  });

  it("기본 size는 md이다", () => {
    render(<Switch aria-label="마케팅 수신" />);

    const switchInput = screen.getByRole("switch", { name: "마케팅 수신" });
    const root = switchInput.closest("label");

    expect(root).toHaveAttribute("data-size", "md");
    expect(switchInput).toHaveAttribute("data-size", "md");
  });

  it("size를 지정할 수 있다", () => {
    render(<Switch aria-label="마케팅 수신" size="sm" />);

    const switchInput = screen.getByRole("switch", { name: "마케팅 수신" });
    const root = switchInput.closest("label");
    const track = switchInput.nextElementSibling;

    expect(root).toHaveAttribute("data-size", "sm");
    expect(root).toHaveClass("h-5", "w-9");
    expect(switchInput).toHaveAttribute("data-size", "sm");
    expect(track).toHaveClass("h-5", "w-9");
  });

  it("defaultChecked 상태를 반영한다", () => {
    render(<Switch aria-label="마케팅 수신" defaultChecked />);

    expect(screen.getByRole("switch", { name: "마케팅 수신" })).toBeChecked();
  });

  it("checked 상태를 제어할 수 있다", () => {
    render(<Switch aria-label="마케팅 수신" checked readOnly />);

    expect(screen.getByRole("switch", { name: "마케팅 수신" })).toBeChecked();
  });

  it("클릭하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Switch aria-label="마케팅 수신" onChange={handleChange} />);

    const switchInput = screen.getByRole("switch", { name: "마케팅 수신" });

    await user.click(switchInput);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(switchInput).toBeChecked();
  });

  it("label 영역을 클릭해도 switch가 토글된다", async () => {
    const user = userEvent.setup();

    render(<Switch aria-label="마케팅 수신" />);

    const switchInput = screen.getByRole("switch", { name: "마케팅 수신" });
    const root = switchInput.closest("label");

    expect(root).not.toBeNull();

    await user.click(root as HTMLLabelElement);

    expect(switchInput).toBeChecked();
  });

  it("disabled 상태를 root와 input에 반영한다", () => {
    render(<Switch aria-label="마케팅 수신" disabled />);

    const switchInput = screen.getByRole("switch", { name: "마케팅 수신" });
    const root = switchInput.closest("label");

    expect(switchInput).toBeDisabled();
    expect(root).toHaveAttribute("data-disabled", "true");
    expect(switchInput).toHaveAttribute("data-disabled", "true");
  });

  it("disabled 상태에서는 클릭해도 토글되지 않는다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Switch aria-label="마케팅 수신" disabled onChange={handleChange} />);

    const switchInput = screen.getByRole("switch", { name: "마케팅 수신" });

    await user.click(switchInput);

    expect(handleChange).not.toHaveBeenCalled();
    expect(switchInput).not.toBeChecked();
  });

  it("hasError가 true이면 invalid 상태를 root와 input에 반영한다", () => {
    render(<Switch aria-label="마케팅 수신" hasError />);

    const switchInput = screen.getByRole("switch", { name: "마케팅 수신" });
    const root = switchInput.closest("label");

    expect(switchInput).toHaveAttribute("aria-invalid", "true");
    expect(root).toHaveAttribute("data-invalid", "true");
    expect(switchInput).toHaveAttribute("data-invalid", "true");
  });

  it("aria-invalid를 직접 지정하면 해당 값을 우선 사용한다", () => {
    render(<Switch aria-label="마케팅 수신" hasError aria-invalid={false} />);

    const switchInput = screen.getByRole("switch", { name: "마케팅 수신" });
    const root = switchInput.closest("label");

    expect(switchInput).toHaveAttribute("aria-invalid", "false");
    expect(root).toHaveAttribute("data-invalid", "true");
    expect(switchInput).toHaveAttribute("data-invalid", "true");
  });

  it("name과 value 속성을 전달한다", () => {
    render(<Switch aria-label="마케팅 수신" name="marketing" value="on" />);

    const switchInput = screen.getByRole("switch", { name: "마케팅 수신" });

    expect(switchInput).toHaveAttribute("name", "marketing");
    expect(switchInput).toHaveAttribute("value", "on");
  });

  it("className은 root에 병합한다", () => {
    render(<Switch aria-label="마케팅 수신" className="custom-switch-root" />);

    const switchInput = screen.getByRole("switch", { name: "마케팅 수신" });
    const root = switchInput.closest("label");

    expect(root).toHaveClass("custom-switch-root");
  });

  it("trackClassName은 track에 병합한다", () => {
    render(<Switch aria-label="마케팅 수신" trackClassName="custom-switch-track" />);

    const switchInput = screen.getByRole("switch", { name: "마케팅 수신" });
    const track = switchInput.nextElementSibling;

    expect(track).toHaveClass("custom-switch-track");
  });
});
