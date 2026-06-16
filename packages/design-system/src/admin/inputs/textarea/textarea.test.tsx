import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Textarea from "./textarea";

describe("Admin Textarea", () => {
  it("textarea를 렌더링한다", () => {
    render(<Textarea aria-label="내용" />);

    expect(screen.getByRole("textbox", { name: "내용" })).toBeInTheDocument();
  });

  it("기본 size는 md이다", () => {
    render(<Textarea aria-label="내용" />);

    expect(screen.getByRole("textbox", { name: "내용" })).toHaveAttribute("data-size", "md");
  });

  it("기본 resize는 vertical이다", () => {
    render(<Textarea aria-label="내용" />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toHaveAttribute("data-resize", "vertical");
    expect(textarea).toHaveClass("resize-y");
  });

  it("size를 지정할 수 있다", () => {
    render(<Textarea aria-label="내용" size="lg" />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toHaveAttribute("data-size", "lg");
    expect(textarea).toHaveClass("text-base");
  });

  it("resize를 지정할 수 있다", () => {
    render(<Textarea aria-label="내용" resize="none" />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toHaveAttribute("data-resize", "none");
    expect(textarea).toHaveClass("resize-none");
  });

  it("placeholder를 전달한다", () => {
    render(<Textarea aria-label="내용" placeholder="내용을 입력해 주세요." />);

    expect(screen.getByRole("textbox", { name: "내용" })).toHaveAttribute(
      "placeholder",
      "내용을 입력해 주세요.",
    );
  });

  it("defaultValue를 반영한다", () => {
    render(<Textarea aria-label="내용" defaultValue="기본 내용" />);

    expect(screen.getByRole("textbox", { name: "내용" })).toHaveValue("기본 내용");
  });

  it("value를 제어할 수 있다", () => {
    render(<Textarea aria-label="내용" value="제어된 내용" readOnly />);

    expect(screen.getByRole("textbox", { name: "내용" })).toHaveValue("제어된 내용");
  });

  it("입력하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Textarea aria-label="내용" onChange={handleChange} />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    await user.type(textarea, "hello");

    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue("hello");
  });

  it("name, rows, maxLength 속성을 전달한다", () => {
    render(<Textarea aria-label="내용" name="content" rows={5} maxLength={200} />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toHaveAttribute("name", "content");
    expect(textarea).toHaveAttribute("rows", "5");
    expect(textarea).toHaveAttribute("maxlength", "200");
  });

  it("disabled 상태를 반영한다", () => {
    render(<Textarea aria-label="내용" disabled />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute("data-disabled", "true");
  });

  it("hasError가 true이면 invalid 상태를 반영한다", () => {
    render(<Textarea aria-label="내용" hasError />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("data-invalid", "true");
  });

  it("aria-invalid를 직접 지정하면 해당 값을 우선 사용한다", () => {
    render(<Textarea aria-label="내용" hasError aria-invalid={false} />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toHaveAttribute("aria-invalid", "false");
    expect(textarea).toHaveAttribute("data-invalid", "true");
  });

  it("className을 병합한다", () => {
    render(<Textarea aria-label="내용" className="custom-textarea" />);

    expect(screen.getByRole("textbox", { name: "내용" })).toHaveClass("custom-textarea");
  });
});
