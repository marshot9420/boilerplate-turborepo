import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { URLS } from "@/constants";

import SocialLoginButtons from "./social-login-buttons";

describe("SocialLoginButtons", () => {
  it("기본 OAuth 로그인 링크들을 렌더링한다", () => {
    render(<SocialLoginButtons />);

    expect(screen.getByRole("link", { name: "Google로 로그인" })).toHaveAttribute(
      "href",
      URLS.API.AUTH.GOOGLE,
    );
    expect(screen.getByRole("link", { name: "네이버로 로그인" })).toHaveAttribute(
      "href",
      URLS.API.AUTH.NAVER,
    );
    expect(screen.getByRole("link", { name: "카카오로 로그인" })).toHaveAttribute(
      "href",
      URLS.API.AUTH.KAKAO,
    );
  });

  it("providers를 전달하면 해당 로그인 링크만 렌더링한다", () => {
    render(
      <SocialLoginButtons
        providers={[
          {
            providerId: "google",
            href: URLS.API.AUTH.GOOGLE,
          },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Google로 로그인" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "네이버로 로그인" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "카카오로 로그인" })).not.toBeInTheDocument();
  });
});
