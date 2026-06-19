import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoginView from "./login-view";

describe("LoginView", () => {
  it("관리자 로그인 화면을 렌더링한다", () => {
    render(<LoginView />);

    expect(screen.getByRole("heading", { name: "관리자 로그인" })).toBeInTheDocument();
    expect(screen.getByText("관리자 권한이 있는 계정으로 로그인해 주세요.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Google로 로그인" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "네이버로 로그인" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "카카오로 로그인" })).toBeInTheDocument();
  });

  it("로그인 에러가 있으면 에러 알림을 렌더링한다", () => {
    render(<LoginView error="forbidden" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("관리자 권한이 필요합니다.")).toBeInTheDocument();
  });
});
