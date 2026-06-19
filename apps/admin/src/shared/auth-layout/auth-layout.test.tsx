import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthLayout from "./auth-layout";

describe("AuthLayout", () => {
  it("인증 화면 레이아웃 안에 children을 렌더링한다", () => {
    render(
      <AuthLayout>
        <p>로그인 콘텐츠</p>
      </AuthLayout>,
    );

    expect(screen.getByText("로그인 콘텐츠")).toBeInTheDocument();
  });
});
