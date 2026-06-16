import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import TextCounter from "./text-counter";

describe("TextCounter", () => {
  it("value의 문자열 길이를 렌더링한다", () => {
    render(<TextCounter value="hello" />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("number value도 문자열 길이 기준으로 계산한다", () => {
    render(<TextCounter value={12345} />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("value가 없으면 0을 렌더링한다", () => {
    render(<TextCounter />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("count가 있으면 value보다 count를 우선 사용한다", () => {
    render(<TextCounter value="hello" count={2} />);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("maxLength가 있으면 count / maxLength 형식으로 렌더링한다", () => {
    render(<TextCounter value="hello" maxLength={10} />);

    expect(screen.getByText("5 / 10")).toBeInTheDocument();
  });

  it("기본 aria-live는 polite다", () => {
    render(<TextCounter value="hello" />);

    expect(screen.getByText("5")).toHaveAttribute("aria-live", "polite");
  });

  it("aria-live를 직접 지정할 수 있다", () => {
    render(<TextCounter value="hello" aria-live="off" />);

    expect(screen.getByText("5")).toHaveAttribute("aria-live", "off");
  });

  it("data-count와 data-max-length를 노출한다", () => {
    render(<TextCounter value="hello" maxLength={10} />);

    const counter = screen.getByText("5 / 10");

    expect(counter).toHaveAttribute("data-count", "5");
    expect(counter).toHaveAttribute("data-max-length", "10");
  });

  it("maxLength를 넘지 않으면 data-over-limit은 false다", () => {
    render(<TextCounter value="hello" maxLength={10} />);

    expect(screen.getByText("5 / 10")).toHaveAttribute("data-over-limit", "false");
  });

  it("maxLength를 넘으면 data-over-limit은 true다", () => {
    render(<TextCounter value="hello world" maxLength={5} />);

    expect(screen.getByText("11 / 5")).toHaveAttribute("data-over-limit", "true");
  });

  it("align과 fullWidth 상태를 className과 data attribute로 반영한다", () => {
    render(<TextCounter value="hello" align="start" fullWidth />);

    const counter = screen.getByText("5");

    expect(counter).toHaveClass("text-left");
    expect(counter).toHaveClass("block");
    expect(counter).toHaveClass("w-full");
    expect(counter).toHaveAttribute("data-full-width", "true");
  });

  it("className을 병합한다", () => {
    render(<TextCounter value="hello" className="custom-counter" />);

    expect(screen.getByText("5")).toHaveClass("custom-counter");
  });

  it("ref를 span element로 전달한다", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<TextCounter ref={ref} value="hello" />);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
