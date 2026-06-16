import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRef } from "react";

import FileInput from "./file-input";

describe("FileInput", () => {
  it("file input을 렌더링한다", () => {
    render(<FileInput aria-label="파일" />);

    expect(screen.getByLabelText("파일")).toBeInTheDocument();
  });

  it("type은 file이다", () => {
    render(<FileInput aria-label="파일" />);

    expect(screen.getByLabelText("파일")).toHaveAttribute("type", "file");
  });

  it("accept를 전달한다", () => {
    render(<FileInput aria-label="이미지" accept="image/*" />);

    expect(screen.getByLabelText("이미지")).toHaveAttribute("accept", "image/*");
  });

  it("multiple 상태를 노출한다", () => {
    render(<FileInput aria-label="파일" multiple />);

    const input = screen.getByLabelText("파일");

    expect(input).toHaveAttribute("multiple");
    expect(input).toHaveAttribute("data-multiple", "true");
  });

  it("기본 multiple 상태는 false다", () => {
    render(<FileInput aria-label="파일" />);

    expect(screen.getByLabelText("파일")).toHaveAttribute("data-multiple", "false");
  });

  it("className을 병합한다", () => {
    render(<FileInput aria-label="파일" className="custom-file-input" />);

    expect(screen.getByLabelText("파일")).toHaveClass("custom-file-input");
  });

  it("기본 size를 data attribute로 노출한다", () => {
    render(<FileInput aria-label="파일" />);

    expect(screen.getByLabelText("파일")).toHaveAttribute("data-size", "md");
  });

  it("전달한 size를 data attribute로 노출한다", () => {
    render(<FileInput aria-label="파일" size="lg" />);

    expect(screen.getByLabelText("파일")).toHaveAttribute("data-size", "lg");
  });

  it("파일을 선택하면 files에 반영된다", async () => {
    const user = userEvent.setup();
    const file = new File(["hello"], "hello.txt", {
      type: "text/plain",
    });

    render(<FileInput aria-label="파일" />);

    const input = screen.getByLabelText("파일") as HTMLInputElement;

    await user.upload(input, file);

    expect(input.files).toHaveLength(1);
    expect(input.files?.[0]).toBe(file);
  });

  it("multiple이면 여러 파일을 선택할 수 있다", async () => {
    const user = userEvent.setup();
    const firstFile = new File(["first"], "first.txt", {
      type: "text/plain",
    });
    const secondFile = new File(["second"], "second.txt", {
      type: "text/plain",
    });

    render(<FileInput aria-label="파일" multiple />);

    const input = screen.getByLabelText("파일") as HTMLInputElement;

    await user.upload(input, [firstFile, secondFile]);

    expect(input.files).toHaveLength(2);
    expect(input.files?.[0]).toBe(firstFile);
    expect(input.files?.[1]).toBe(secondFile);
  });

  it("change 이벤트를 호출한다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const file = new File(["hello"], "hello.txt", {
      type: "text/plain",
    });

    render(<FileInput aria-label="파일" onChange={handleChange} />);

    await user.upload(screen.getByLabelText("파일"), file);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태에서는 파일을 선택하지 않는다", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const file = new File(["hello"], "hello.txt", {
      type: "text/plain",
    });

    render(<FileInput aria-label="파일" disabled onChange={handleChange} />);

    const input = screen.getByLabelText("파일") as HTMLInputElement;

    await user.upload(input, file);

    expect(input).toBeDisabled();
    expect(input.files).toHaveLength(0);
    expect(input).toHaveAttribute("data-disabled", "true");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("hasError가 true이면 aria-invalid와 data-invalid를 노출한다", () => {
    render(<FileInput aria-label="파일" hasError />);

    const input = screen.getByLabelText("파일");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("hasError가 false이면 invalid 상태를 노출하지 않는다", () => {
    render(<FileInput aria-label="파일" />);

    const input = screen.getByLabelText("파일");

    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).toHaveAttribute("data-invalid", "false");
  });

  it("명시적으로 전달한 aria-invalid를 우선 사용한다", () => {
    render(<FileInput aria-label="파일" hasError aria-invalid={false} />);

    const input = screen.getByLabelText("파일");

    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("ref를 input element로 전달한다", () => {
    const ref = createRef<HTMLInputElement>();

    render(<FileInput ref={ref} aria-label="파일" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
