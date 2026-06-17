import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import FieldError from "./field-error";

describe("Web FieldError", () => {
  it("message를 렌더링한다", () => {
    render(<FieldError message="올바른 이메일 형식이 아닙니다." />);

    const error = screen.getByRole("alert");

    expect(error).toHaveTextContent("올바른 이메일 형식이 아닙니다.");
    expect(error).toHaveAttribute("aria-live", "polite");
    expect(error).toHaveAttribute("data-size", "md");
  });

  it("children을 렌더링한다", () => {
    render(<FieldError>닉네임을 입력해 주세요.</FieldError>);

    expect(screen.getByRole("alert")).toHaveTextContent("닉네임을 입력해 주세요.");
  });

  it("children이 message보다 우선한다", () => {
    render(<FieldError message="message 에러">children 에러</FieldError>);

    expect(screen.getByRole("alert")).toHaveTextContent("children 에러");
    expect(screen.queryByText("message 에러")).not.toBeInTheDocument();
  });

  it("content가 없으면 렌더링하지 않는다", () => {
    render(<FieldError />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("role을 덮어쓸 수 있다", () => {
    render(<FieldError role="status">상태 메시지</FieldError>);

    expect(screen.getByRole("status")).toHaveTextContent("상태 메시지");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("aria-live를 덮어쓸 수 있다", () => {
    render(<FieldError aria-live="assertive">즉시 알림</FieldError>);

    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
  });

  it("size를 적용한다", () => {
    render(<FieldError size="sm">작은 에러</FieldError>);

    const error = screen.getByRole("alert");

    expect(error).toHaveAttribute("data-size", "sm");
    expect(error).toHaveClass("text-xs");
  });

  it("className을 병합한다", () => {
    render(<FieldError className="custom-error">에러</FieldError>);

    expect(screen.getByRole("alert")).toHaveClass("custom-error");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLParagraphElement>();

    render(<FieldError ref={ref}>에러</FieldError>);

    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it("message가 0이면 렌더링한다", () => {
    render(<FieldError message={0} />);

    const error = screen.getByRole("alert");

    expect(error).toHaveTextContent("0");
    expect(error).toHaveAttribute("data-size", "md");
  });

  it("children이 숫자 0이면 렌더링한다", () => {
    render(<FieldError>{0}</FieldError>);

    expect(screen.getByRole("alert")).toHaveTextContent("0");
  });
});
