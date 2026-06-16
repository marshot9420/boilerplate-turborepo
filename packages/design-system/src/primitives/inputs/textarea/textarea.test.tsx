import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRef } from "react";

import Textarea from "./textarea";

describe("Textarea", () => {
  it("textarea를 렌더링한다", () => {
    render(<Textarea aria-label="내용" />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toBeInTheDocument();
  });

  it("className을 병합한다", () => {
    render(<Textarea aria-label="내용" className="custom-textarea" />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toHaveClass("custom-textarea");
  });

  it("기본 size와 resize를 data attribute로 노출한다", () => {
    render(<Textarea aria-label="내용" />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toHaveAttribute("data-size", "md");
    expect(textarea).toHaveAttribute("data-resize", "vertical");
  });

  it("전달한 size와 resize를 data attribute로 노출한다", () => {
    render(<Textarea aria-label="내용" size="lg" resize="none" />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toHaveAttribute("data-size", "lg");
    expect(textarea).toHaveAttribute("data-resize", "none");
  });

  it("placeholder를 렌더링한다", () => {
    render(<Textarea aria-label="내용" placeholder="내용을 입력해 주세요" />);

    expect(
      screen.getByPlaceholderText("내용을 입력해 주세요"),
    ).toBeInTheDocument();
  });

  it("defaultValue를 렌더링한다", () => {
    render(<Textarea aria-label="내용" defaultValue="기본 내용" />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toHaveValue("기본 내용");
  });

  it("입력 이벤트를 처리한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Textarea aria-label="내용" onChange={handleChange} />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    await user.type(textarea, "테스트 내용");

    expect(textarea).toHaveValue("테스트 내용");
    expect(handleChange).toHaveBeenCalled();
  });

  it("disabled가 true이면 비활성화 상태를 노출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Textarea aria-label="내용" disabled onChange={handleChange} />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    await user.type(textarea, "테스트 내용");

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute("data-disabled", "true");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("hasError가 true이면 aria-invalid와 data-invalid를 노출한다", () => {
    render(<Textarea aria-label="내용" hasError />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("data-invalid", "true");
  });

  it("hasError가 false이면 invalid 상태를 노출하지 않는다", () => {
    render(<Textarea aria-label="내용" />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).not.toHaveAttribute("aria-invalid");
    expect(textarea).toHaveAttribute("data-invalid", "false");
  });

  it("명시적으로 전달한 aria-invalid를 우선 사용한다", () => {
    render(<Textarea aria-label="내용" hasError aria-invalid={false} />);

    const textarea = screen.getByRole("textbox", { name: "내용" });

    expect(textarea).toHaveAttribute("aria-invalid", "false");
    expect(textarea).toHaveAttribute("data-invalid", "true");
  });

  it("ref를 textarea element로 전달한다", () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(<Textarea ref={ref} aria-label="내용" />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
