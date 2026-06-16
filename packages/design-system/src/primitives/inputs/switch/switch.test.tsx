import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRef } from "react";

import Switch from "./switch";

describe("Switch", () => {
  it("switch를 렌더링한다", () => {
    render(<Switch aria-label="알림 받기" />);

    expect(
      screen.getByRole("switch", { name: "알림 받기" }),
    ).toBeInTheDocument();
  });

  it("type은 checkbox다", () => {
    render(<Switch aria-label="알림 받기" />);

    expect(screen.getByRole("switch", { name: "알림 받기" })).toHaveAttribute(
      "type",
      "checkbox",
    );
  });

  it("기본 size를 data attribute로 노출한다", () => {
    render(<Switch aria-label="알림 받기" />);

    expect(screen.getByRole("switch", { name: "알림 받기" })).toHaveAttribute(
      "data-size",
      "md",
    );
  });

  it("전달한 size를 data attribute로 노출한다", () => {
    render(<Switch aria-label="알림 받기" size="lg" />);

    expect(screen.getByRole("switch", { name: "알림 받기" })).toHaveAttribute(
      "data-size",
      "lg",
    );
  });

  it("className을 root에 병합한다", () => {
    render(<Switch aria-label="알림 받기" className="custom-switch" />);

    const switchElement = screen.getByRole("switch", { name: "알림 받기" });

    expect(switchElement.parentElement).toHaveClass("custom-switch");
  });

  it("defaultChecked를 렌더링한다", () => {
    render(<Switch aria-label="알림 받기" defaultChecked />);

    expect(screen.getByRole("switch", { name: "알림 받기" })).toBeChecked();
  });

  it("클릭하면 checked 상태가 변경된다", async () => {
    const user = userEvent.setup();

    render(<Switch aria-label="알림 받기" />);

    const switchElement = screen.getByRole("switch", { name: "알림 받기" });

    await user.click(switchElement);

    expect(switchElement).toBeChecked();
  });

  it("change 이벤트를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Switch aria-label="알림 받기" onChange={handleChange} />);

    await user.click(screen.getByRole("switch", { name: "알림 받기" }));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태에서는 변경되지 않는다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Switch aria-label="알림 받기" disabled onChange={handleChange} />);

    const switchElement = screen.getByRole("switch", { name: "알림 받기" });

    await user.click(switchElement);

    expect(switchElement).toBeDisabled();
    expect(switchElement).not.toBeChecked();
    expect(switchElement).toHaveAttribute("data-disabled", "true");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("hasError가 true이면 aria-invalid와 data-invalid를 노출한다", () => {
    render(<Switch aria-label="알림 받기" hasError />);

    const switchElement = screen.getByRole("switch", { name: "알림 받기" });

    expect(switchElement).toHaveAttribute("aria-invalid", "true");
    expect(switchElement).toHaveAttribute("data-invalid", "true");
  });

  it("명시적으로 전달한 aria-invalid를 우선 사용한다", () => {
    render(<Switch aria-label="알림 받기" hasError aria-invalid={false} />);

    const switchElement = screen.getByRole("switch", { name: "알림 받기" });

    expect(switchElement).toHaveAttribute("aria-invalid", "false");
    expect(switchElement).toHaveAttribute("data-invalid", "true");
  });

  it("ref를 input element로 전달한다", () => {
    const ref = createRef<HTMLInputElement>();

    render(<Switch ref={ref} aria-label="알림 받기" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
