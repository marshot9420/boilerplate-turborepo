import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import FileInput from "./file-input";

describe("Admin FileInput", () => {
  it("file input을 렌더링한다", () => {
    render(<FileInput aria-label="파일 선택" />);

    const input = screen.getByLabelText("파일 선택");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "file");
  });

  it("기본 size는 md이다", () => {
    render(<FileInput aria-label="파일 선택" />);

    expect(screen.getByLabelText("파일 선택")).toHaveAttribute("data-size", "md");
  });

  it("size를 지정할 수 있다", () => {
    render(<FileInput aria-label="파일 선택" size="lg" />);

    const input = screen.getByLabelText("파일 선택");

    expect(input).toHaveAttribute("data-size", "lg");
    expect(input).toHaveClass("h-12");
  });

  it("accept 속성을 전달한다", () => {
    render(<FileInput aria-label="파일 선택" accept="image/png,image/jpeg" />);

    expect(screen.getByLabelText("파일 선택")).toHaveAttribute("accept", "image/png,image/jpeg");
  });

  it("multiple 상태를 반영한다", () => {
    render(<FileInput aria-label="파일 선택" multiple />);

    const input = screen.getByLabelText("파일 선택");

    expect(input).toHaveAttribute("multiple");
    expect(input).toHaveAttribute("data-multiple", "true");
  });

  it("multiple이 아니면 data-multiple은 false이다", () => {
    render(<FileInput aria-label="파일 선택" />);

    expect(screen.getByLabelText("파일 선택")).toHaveAttribute("data-multiple", "false");
  });

  it("파일을 선택하면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    render(<FileInput aria-label="파일 선택" onChange={handleChange} />);

    const input = screen.getByLabelText("파일 선택") as HTMLInputElement;

    await user.upload(input, file);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input.files).toHaveLength(1);
    expect(input.files?.[0]).toBe(file);
  });

  it("multiple이면 여러 파일을 선택할 수 있다", async () => {
    const user = userEvent.setup();
    const firstFile = new File(["first"], "first.png", { type: "image/png" });
    const secondFile = new File(["second"], "second.jpg", {
      type: "image/jpeg",
    });

    render(<FileInput aria-label="파일 선택" multiple />);

    const input = screen.getByLabelText("파일 선택") as HTMLInputElement;

    await user.upload(input, [firstFile, secondFile]);

    expect(input.files).toHaveLength(2);
    expect(input.files?.[0]).toBe(firstFile);
    expect(input.files?.[1]).toBe(secondFile);
  });

  it("disabled 상태를 반영한다", () => {
    render(<FileInput aria-label="파일 선택" disabled />);

    const input = screen.getByLabelText("파일 선택");

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("data-disabled", "true");
  });

  it("hasError가 true이면 invalid 상태를 반영한다", () => {
    render(<FileInput aria-label="파일 선택" hasError />);

    const input = screen.getByLabelText("파일 선택");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("aria-invalid를 직접 지정하면 해당 값을 우선 사용한다", () => {
    render(<FileInput aria-label="파일 선택" hasError aria-invalid={false} />);

    const input = screen.getByLabelText("파일 선택");

    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("className을 병합한다", () => {
    render(<FileInput aria-label="파일 선택" className="custom-file-input" />);

    expect(screen.getByLabelText("파일 선택")).toHaveClass("custom-file-input");
  });
});
