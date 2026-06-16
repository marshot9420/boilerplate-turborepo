import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import Spinner from "./spinner";

describe("Web Spinner", () => {
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
    render(<Spinner size="sm" />);

    const spinner = screen.getByRole("status", {
      name: "로딩 중",
    });

    expect(spinner).toHaveAttribute("data-size", "sm");
    expect(spinner).toHaveClass("size-4");
  });

  it("label을 aria-label로 사용한다", () => {
    render(<Spinner label="화면을 불러오는 중" />);

    expect(
      screen.getByRole("status", {
        name: "화면을 불러오는 중",
      }),
    ).toBeInTheDocument();
  });

  it("aria-label이 있으면 label보다 우선한다", () => {
    render(<Spinner label="로딩 중" aria-label="다시 시도 중" />);

    expect(
      screen.getByRole("status", {
        name: "다시 시도 중",
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
    render(<Spinner variant="inverse" />);

    const spinner = screen.getByRole("status", {
      name: "로딩 중",
    });

    expect(spinner).toHaveAttribute("data-variant", "inverse");
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
