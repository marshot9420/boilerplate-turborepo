import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Textarea from "./textarea";

describe("Web Textarea", () => {
  it("textarea를 렌더링한다", () => {
    render(<Textarea aria-label="소개" />);

    expect(screen.getByRole("textbox", { name: "소개" })).toBeInTheDocument();
  });

  it("기본 size는 md이다", () => {
    render(<Textarea aria-label="소개" />);

    expect(screen.getByRole("textbox", { name: "소개" })).toHaveAttribute("data-size", "md");
  });

  it("기본 resize는 vertical이다", () => {
    render(<Textarea aria-label="소개" />);

    const textarea = screen.getByRole("textbox", { name: "소개" });

    expect(textarea).toHaveAttribute("data-resize", "vertical");
    expect(textarea).toHaveClass("resize-y");
  });

  it("size를 지정할 수 있다", () => {
    render(<Textarea aria-label="소개" size="sm" />);

    const textarea = screen.getByRole("textbox", { name: "소개" });

    expect(textarea).toHaveAttribute("data-size", "sm");
    expect(textarea).toHaveClass("text-sm");
  });

  it("resize를 지정할 수 있다", () => {
    render(<Textarea aria-label="소개" resize="both" />);

    const textarea = screen.getByRole("textbox", { name: "소개" });

    expect(textarea).toHaveAttribute("data-resize", "both");
    expect(textarea).toHaveClass("resize");
  });

  it("placeholder를 전달한다", () => {
    render(<Textarea aria-label="소개" placeholder="소개를 입력해 주세요." />);

    expect(screen.getByRole("textbox", { name: "소개" })).toHaveAttribute(
      "placeholder",
      "소개를 입력해 주세요.",
    );
  });

  it("defaultValue를 반영한다", () => {
    render(<Textarea aria-label="소개" defaultValue="기본 소개" />);

    expect(screen.getByRole("textbox", { name: "소개" })).toHaveValue("기본 소개");
  });

  it("value를 제어할 수 있다", () => {
    render(<Textarea aria-label="소개" value="제어된 소개" readOnly />);

    expect(screen.getByRole("textbox", { name: "소개" })).toHaveValue("제어된 소개");
  });

  it("입력하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Textarea aria-label="소개" onChange={handleChange} />);

    const textarea = screen.getByRole("textbox", { name: "소개" });

    await user.type(textarea, "hello");

    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue("hello");
  });

  it("name, rows, maxLength 속성을 전달한다", () => {
    render(<Textarea aria-label="소개" name="description" rows={4} maxLength={300} />);

    const textarea = screen.getByRole("textbox", { name: "소개" });

    expect(textarea).toHaveAttribute("name", "description");
    expect(textarea).toHaveAttribute("rows", "4");
    expect(textarea).toHaveAttribute("maxlength", "300");
  });

  it("disabled 상태를 반영한다", () => {
    render(<Textarea aria-label="소개" disabled />);

    const textarea = screen.getByRole("textbox", { name: "소개" });

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute("data-disabled", "true");
  });

  it("hasError가 true이면 invalid 상태를 반영한다", () => {
    render(<Textarea aria-label="소개" hasError />);

    const textarea = screen.getByRole("textbox", { name: "소개" });

    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("data-invalid", "true");
  });

  it("aria-invalid를 직접 지정하면 해당 값을 우선 사용한다", () => {
    render(<Textarea aria-label="소개" hasError aria-invalid={false} />);

    const textarea = screen.getByRole("textbox", { name: "소개" });

    expect(textarea).toHaveAttribute("aria-invalid", "false");
    expect(textarea).toHaveAttribute("data-invalid", "true");
  });

  it("className을 병합한다", () => {
    render(<Textarea aria-label="소개" className="custom-textarea" />);

    expect(screen.getByRole("textbox", { name: "소개" })).toHaveClass("custom-textarea");
  });
});
