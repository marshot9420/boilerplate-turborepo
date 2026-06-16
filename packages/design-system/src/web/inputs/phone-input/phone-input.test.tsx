import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import PhoneInput from "./phone-input";

describe("Web PhoneInput", () => {
  it("tel input을 렌더링한다", () => {
    render(<PhoneInput aria-label="전화번호" />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "tel");
  });

  it("기본 size는 md이다", () => {
    render(<PhoneInput aria-label="전화번호" />);

    const input = screen.getByRole("textbox", { name: "전화번호" });
    const root = input.parentElement;

    expect(root).toHaveAttribute("data-size", "md");
    expect(input).toHaveAttribute("data-size", "md");
  });

  it("size를 지정할 수 있다", () => {
    render(<PhoneInput aria-label="전화번호" size="sm" />);

    const input = screen.getByRole("textbox", { name: "전화번호" });
    const root = input.parentElement;

    expect(root).toHaveAttribute("data-size", "sm");
    expect(root).toHaveClass("h-8");
    expect(input).toHaveAttribute("data-size", "sm");
  });

  it("inputMode 기본값은 tel이다", () => {
    render(<PhoneInput aria-label="전화번호" />);

    expect(screen.getByRole("textbox", { name: "전화번호" })).toHaveAttribute("inputmode", "tel");
  });

  it("autoComplete 기본값은 tel이다", () => {
    render(<PhoneInput aria-label="전화번호" />);

    expect(screen.getByRole("textbox", { name: "전화번호" })).toHaveAttribute(
      "autocomplete",
      "tel",
    );
  });

  it("inputMode와 autoComplete를 직접 지정할 수 있다", () => {
    render(<PhoneInput aria-label="전화번호" inputMode="numeric" autoComplete="mobile tel" />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("autocomplete", "mobile tel");
  });

  it("prefixSlot을 렌더링한다", () => {
    render(<PhoneInput aria-label="전화번호" prefixSlot="+82" />);

    expect(screen.getByText("+82")).toBeInTheDocument();
  });

  it("suffixSlot을 렌더링한다", () => {
    render(<PhoneInput aria-label="전화번호" suffixSlot="인증" />);

    expect(screen.getByText("인증")).toBeInTheDocument();
  });

  it("placeholder를 전달한다", () => {
    render(<PhoneInput aria-label="전화번호" placeholder="010-0000-0000" />);

    expect(screen.getByRole("textbox", { name: "전화번호" })).toHaveAttribute(
      "placeholder",
      "010-0000-0000",
    );
  });

  it("value를 제어할 수 있다", () => {
    render(<PhoneInput aria-label="전화번호" value="01012345678" readOnly />);

    expect(screen.getByRole("textbox", { name: "전화번호" })).toHaveValue("01012345678");
  });

  it("입력하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<PhoneInput aria-label="전화번호" onChange={handleChange} />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    await user.type(input, "01012345678");

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue("01012345678");
  });

  it("disabled 상태를 root와 input에 반영한다", () => {
    render(<PhoneInput aria-label="전화번호" disabled />);

    const input = screen.getByRole("textbox", { name: "전화번호" });
    const root = input.parentElement;

    expect(input).toBeDisabled();
    expect(root).toHaveAttribute("data-disabled", "true");
    expect(input).toHaveAttribute("data-disabled", "true");
  });

  it("hasError가 true이면 invalid 상태를 root와 input에 반영한다", () => {
    render(<PhoneInput aria-label="전화번호" hasError />);

    const input = screen.getByRole("textbox", { name: "전화번호" });
    const root = input.parentElement;

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(root).toHaveAttribute("data-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("aria-invalid를 직접 지정하면 해당 값을 우선 사용한다", () => {
    render(<PhoneInput aria-label="전화번호" hasError aria-invalid={false} />);

    const input = screen.getByRole("textbox", { name: "전화번호" });
    const root = input.parentElement;

    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(root).toHaveAttribute("data-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("name 속성을 전달한다", () => {
    render(<PhoneInput aria-label="전화번호" name="phone" />);

    expect(screen.getByRole("textbox", { name: "전화번호" })).toHaveAttribute("name", "phone");
  });

  it("className은 root에 병합한다", () => {
    render(<PhoneInput aria-label="전화번호" className="custom-root" />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    expect(input.parentElement).toHaveClass("custom-root");
  });

  it("inputClassName은 input에 병합한다", () => {
    render(<PhoneInput aria-label="전화번호" inputClassName="custom-phone-input" />);

    expect(screen.getByRole("textbox", { name: "전화번호" })).toHaveClass("custom-phone-input");
  });
});
