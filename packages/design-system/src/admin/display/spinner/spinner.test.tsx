import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import Spinner from "./spinner";

describe("Admin Spinner", () => {
  it("기본 status spinner를 렌더링한다", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status", {
      name: "로딩 중",
    });

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("data-size", "md");
    expect(spinner).toHaveAttribute("data-decorative", "false");
    expect(spinner).toHaveAttribute("data-variant", "default");
  });

  it("size를 적용한다", () => {
    render(<Spinner size="lg" />);

    const spinner = screen.getByRole("status", {
      name: "로딩 중",
    });

    expect(spinner).toHaveAttribute("data-size", "lg");
    expect(spinner).toHaveClass("size-6");
  });

  it("label을 aria-label로 사용한다", () => {
    render(<Spinner label="콘텐츠를 불러오는 중" />);

    expect(
      screen.getByRole("status", {
        name: "콘텐츠를 불러오는 중",
      }),
    ).toBeInTheDocument();
  });

  it("aria-label이 있으면 label보다 우선한다", () => {
    render(<Spinner label="로딩 중" aria-label="요청 처리 중" />);

    expect(
      screen.getByRole("status", {
        name: "요청 처리 중",
      }),
    ).toBeInTheDocument();
  });

  it("decorative가 true이면 접근성 role과 label을 제거한다", () => {
    render(<Spinner data-testid="spinner" decorative />);

    const spinner = screen.getByTestId("spinner");

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-hidden", "true");
    expect(spinner).toHaveAttribute("data-decorative", "true");
    expect(spinner).not.toHaveAttribute("aria-label");
  });

  it("variant를 적용한다", () => {
    render(<Spinner variant="muted" />);

    const spinner = screen.getByRole("status", {
      name: "로딩 중",
    });

    expect(spinner).toHaveAttribute("data-variant", "muted");
  });

  it("className을 병합한다", () => {
    render(<Spinner className="custom-spinner" />);

    expect(
      screen.getByRole("status", {
        name: "로딩 중",
      }),
    ).toHaveClass("custom-spinner");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Spinner ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
