import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRef } from "react";

import PhoneInput from "./phone-input";

describe("PhoneInput", () => {
  it("phone input을 렌더링한다", () => {
    render(<PhoneInput aria-label="전화번호" />);

    expect(screen.getByRole("textbox", { name: "전화번호" })).toBeInTheDocument();
  });

  it("type은 tel이다", () => {
    render(<PhoneInput aria-label="전화번호" />);

    expect(screen.getByRole("textbox", { name: "전화번호" })).toHaveAttribute("type", "tel");
  });

  it("기본 inputMode와 autoComplete를 tel로 설정한다", () => {
    render(<PhoneInput aria-label="전화번호" />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    expect(input).toHaveAttribute("inputmode", "tel");
    expect(input).toHaveAttribute("autocomplete", "tel");
  });

  it("전달한 inputMode와 autoComplete를 우선 사용한다", () => {
    render(<PhoneInput aria-label="전화번호" inputMode="numeric" autoComplete="tel-national" />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("autocomplete", "tel-national");
  });

  it("className을 root에 병합한다", () => {
    render(<PhoneInput aria-label="전화번호" className="custom-root" />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    expect(input.parentElement).toHaveClass("custom-root");
  });

  it("inputClassName을 input에 병합한다", () => {
    render(<PhoneInput aria-label="전화번호" inputClassName="custom-input" />);

    expect(screen.getByRole("textbox", { name: "전화번호" })).toHaveClass("custom-input");
  });

  it("기본 size를 data attribute로 노출한다", () => {
    render(<PhoneInput aria-label="전화번호" />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    expect(input).toHaveAttribute("data-size", "md");
    expect(input.parentElement).toHaveAttribute("data-size", "md");
  });

  it("전달한 size를 data attribute로 노출한다", () => {
    render(<PhoneInput aria-label="전화번호" size="lg" />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    expect(input).toHaveAttribute("data-size", "lg");
    expect(input.parentElement).toHaveAttribute("data-size", "lg");
  });

  it("placeholder를 렌더링한다", () => {
    render(<PhoneInput aria-label="전화번호" placeholder="010-0000-0000" />);

    expect(screen.getByPlaceholderText("010-0000-0000")).toBeInTheDocument();
  });

  it("defaultValue를 렌더링한다", () => {
    render(<PhoneInput aria-label="전화번호" defaultValue="01012345678" />);

    expect(screen.getByRole("textbox", { name: "전화번호" })).toHaveValue("01012345678");
  });

  it("입력 이벤트를 처리한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<PhoneInput aria-label="전화번호" onChange={handleChange} />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    await user.type(input, "01012345678");

    expect(input).toHaveValue("01012345678");
    expect(handleChange).toHaveBeenCalled();
  });

  it("disabled 상태에서는 입력되지 않는다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<PhoneInput aria-label="전화번호" disabled onChange={handleChange} />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    await user.type(input, "01012345678");

    expect(input).toBeDisabled();
    expect(input).toHaveValue("");
    expect(input).toHaveAttribute("data-disabled", "true");
    expect(input.parentElement).toHaveAttribute("data-disabled", "true");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("hasError가 true이면 aria-invalid와 data-invalid를 노출한다", () => {
    render(<PhoneInput aria-label="전화번호" hasError />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "true");
    expect(input.parentElement).toHaveAttribute("data-invalid", "true");
  });

  it("hasError가 false이면 invalid 상태를 노출하지 않는다", () => {
    render(<PhoneInput aria-label="전화번호" />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).toHaveAttribute("data-invalid", "false");
    expect(input.parentElement).toHaveAttribute("data-invalid", "false");
  });

  it("명시적으로 전달한 aria-invalid를 우선 사용한다", () => {
    render(<PhoneInput aria-label="전화번호" hasError aria-invalid={false} />);

    const input = screen.getByRole("textbox", { name: "전화번호" });

    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("prefixSlot과 suffixSlot을 렌더링한다", () => {
    render(
      <PhoneInput
        aria-label="전화번호"
        prefixSlot={<span data-testid="prefix-slot">+82</span>}
        suffixSlot={<span data-testid="suffix-slot">인증</span>}
      />,
    );

    expect(screen.getByTestId("prefix-slot")).toHaveTextContent("+82");
    expect(screen.getByTestId("suffix-slot")).toHaveTextContent("인증");
  });

  it("ref를 input element로 전달한다", () => {
    const ref = createRef<HTMLInputElement>();

    render(<PhoneInput ref={ref} aria-label="전화번호" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
