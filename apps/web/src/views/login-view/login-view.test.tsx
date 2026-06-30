import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { URLS } from "@/constants";

import LoginView from "./login-view";

describe("LoginView", () => {
  it("로그인 화면을 렌더링한다", () => {
    render(<LoginView />);

    expect(screen.getByRole("heading", { name: "로그인" })).toBeInTheDocument();
    expect(screen.getByText("소셜 계정으로 간편하게 로그인하세요.")).toBeInTheDocument();
  });

  it("소셜 로그인 버튼을 렌더링한다", () => {
    render(<LoginView />);

    expect(screen.getByRole("link", { name: /Google/ })).toHaveAttribute(
      "href",
      URLS.API.AUTH.GOOGLE,
    );

    expect(screen.getByRole("link", { name: /Naver/ })).toHaveAttribute(
      "href",
      URLS.API.AUTH.NAVER,
    );

    expect(screen.getByRole("link", { name: /Kakao/ })).toHaveAttribute(
      "href",
      URLS.API.AUTH.KAKAO,
    );
  });

  it("error가 없으면 alert를 렌더링하지 않는다", () => {
    render(<LoginView />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("oauth_failed error 메시지를 렌더링한다", () => {
    render(<LoginView error="oauth_failed" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("소셜 로그인에 실패했습니다. 다시 시도해 주세요.")).toBeInTheDocument();
  });

  it("알 수 없는 error면 기본 error 메시지를 렌더링한다", () => {
    render(<LoginView error="unknown_error" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("로그인 처리 중 문제가 발생했습니다.")).toBeInTheDocument();
  });
});
