import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoginErrorAlert from "./login-error-alert";

describe("LoginErrorAlert", () => {
  it("error가 없으면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(<LoginErrorAlert />);

    expect(container).toBeEmptyDOMElement();
  });

  it("알려진 에러 메시지를 렌더링한다", () => {
    render(<LoginErrorAlert error="forbidden" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("관리자 권한이 필요합니다.")).toBeInTheDocument();
    expect(
      screen.getByText("관리자 권한이 있는 계정으로 다시 로그인해 주세요."),
    ).toBeInTheDocument();
  });

  it("알 수 없는 에러이면 기본 에러 메시지를 렌더링한다", () => {
    render(<LoginErrorAlert error="unknown_error" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("로그인에 실패했습니다.")).toBeInTheDocument();
    expect(screen.getByText("로그인 정보를 확인한 뒤 다시 시도해 주세요.")).toBeInTheDocument();
  });
});
