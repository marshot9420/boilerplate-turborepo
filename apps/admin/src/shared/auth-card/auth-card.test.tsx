import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthCard from "./auth-card";

describe("AuthCard", () => {
  it("제목, 설명, children을 렌더링한다", () => {
    render(
      <AuthCard title="관리자 로그인" description="관리자 권한으로 로그인해 주세요.">
        <button type="button">로그인</button>
      </AuthCard>,
    );

    expect(screen.getByRole("heading", { name: "관리자 로그인" })).toBeInTheDocument();
    expect(screen.getByText("관리자 권한으로 로그인해 주세요.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
  });

  it("footer가 있으면 하단 영역을 렌더링한다", () => {
    render(
      <AuthCard title="관리자 로그인" footer={<p>관리자 전용 페이지입니다.</p>}>
        <button type="button">로그인</button>
      </AuthCard>,
    );

    expect(screen.getByText("관리자 전용 페이지입니다.")).toBeInTheDocument();
  });
});
