import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import FieldError from "./field-error";

describe("FieldError", () => {
  it("message를 렌더링한다", () => {
    render(<FieldError message="이메일을 입력해 주세요." />);

    expect(screen.getByText("이메일을 입력해 주세요.")).toBeInTheDocument();
  });

  it("children이 있으면 children을 우선 렌더링한다", () => {
    render(<FieldError message="message">children</FieldError>);

    expect(screen.getByText("children")).toBeInTheDocument();
    expect(screen.queryByText("message")).not.toBeInTheDocument();
  });

  it("내용이 없으면 렌더링하지 않는다", () => {
    const { container } = render(<FieldError />);

    expect(container).toBeEmptyDOMElement();
  });

  it("기본 role은 alert이다", () => {
    render(<FieldError message="오류 메시지" />);

    expect(screen.getByRole("alert")).toHaveTextContent("오류 메시지");
  });

  it("기본 aria-live는 polite다", () => {
    render(<FieldError message="오류 메시지" />);

    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "polite");
  });

  it("role과 aria-live를 직접 지정할 수 있다", () => {
    render(<FieldError message="오류 메시지" role="status" aria-live="assertive" />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "assertive");
  });

  it("className을 병합한다", () => {
    render(<FieldError message="오류 메시지" className="custom-error" />);

    expect(screen.getByText("오류 메시지")).toHaveClass("custom-error");
  });

  it("ref를 p element로 전달한다", () => {
    const ref = createRef<HTMLParagraphElement>();

    render(<FieldError ref={ref} message="오류 메시지" />);

    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it("message가 0이면 렌더링한다", () => {
    render(<FieldError message={0} />);

    expect(screen.getByRole("alert")).toHaveTextContent("0");
  });

  it("children이 0이면 children을 렌더링한다", () => {
    render(<FieldError message="message">0</FieldError>);

    expect(screen.getByRole("alert")).toHaveTextContent("0");
    expect(screen.queryByText("message")).not.toBeInTheDocument();
  });

  it("빈 문자열이면 렌더링하지 않는다", () => {
    const { container } = render(<FieldError message="" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("boolean 값이면 렌더링하지 않는다", () => {
    const { container } = render(<FieldError message={false} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("children이 숫자 0이면 렌더링한다", () => {
    render(<FieldError>{0}</FieldError>);

    expect(screen.getByRole("alert")).toHaveTextContent("0");
  });
});
