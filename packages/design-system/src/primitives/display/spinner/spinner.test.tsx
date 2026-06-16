import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import Spinner from "./spinner";

describe("Spinner", () => {
  it("기본 role은 status이고 기본 label을 가진다", () => {
    render(<Spinner />);

    expect(screen.getByRole("status", { name: "로딩 중" })).toBeInTheDocument();
  });

  it("label을 직접 지정할 수 있다", () => {
    render(<Spinner label="불러오는 중" />);

    expect(screen.getByRole("status", { name: "불러오는 중" })).toBeInTheDocument();
  });

  it("aria-label을 직접 지정하면 aria-label을 우선 사용한다", () => {
    render(<Spinner label="로딩 중" aria-label="데이터 불러오는 중" />);

    expect(screen.getByRole("status", { name: "데이터 불러오는 중" })).toBeInTheDocument();
  });

  it("기본 size를 data attribute로 노출한다", () => {
    render(<Spinner />);

    expect(screen.getByRole("status", { name: "로딩 중" })).toHaveAttribute("data-size", "md");
  });

  it("전달한 size를 data attribute로 노출한다", () => {
    render(<Spinner size="lg" />);

    expect(screen.getByRole("status", { name: "로딩 중" })).toHaveAttribute("data-size", "lg");
  });

  it("decorative가 true이면 role과 aria-label 없이 aria-hidden을 노출한다", () => {
    render(<Spinner data-testid="spinner" decorative />);

    const spinner = screen.getByTestId("spinner");

    expect(spinner).not.toHaveAttribute("role");
    expect(spinner).not.toHaveAttribute("aria-label");
    expect(spinner).toHaveAttribute("aria-hidden", "true");
    expect(spinner).toHaveAttribute("data-decorative", "true");
  });

  it("className을 병합한다", () => {
    render(<Spinner className="custom-spinner" />);

    expect(screen.getByRole("status", { name: "로딩 중" })).toHaveClass("custom-spinner");
  });

  it("ref를 span element로 전달한다", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Spinner ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
