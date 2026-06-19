import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { URLS } from "@/constants";

import SocialLoginButtons from "./social-login-buttons";

describe("SocialLoginButtons", () => {
  it("소셜 로그인 영역을 렌더링한다", () => {
    render(<SocialLoginButtons />);

    expect(screen.getByLabelText("소셜 로그인")).toBeInTheDocument();
  });

  it("기본 provider 링크를 모두 렌더링한다", () => {
    render(<SocialLoginButtons />);

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

  it("지정한 provider만 렌더링한다", () => {
    render(<SocialLoginButtons providers={["google"]} />);

    const socialLogin = screen.getByLabelText("소셜 로그인");

    expect(within(socialLogin).getByRole("link", { name: /Google/ })).toBeInTheDocument();
    expect(within(socialLogin).queryByRole("link", { name: /Naver/ })).not.toBeInTheDocument();
    expect(within(socialLogin).queryByRole("link", { name: /Kakao/ })).not.toBeInTheDocument();
  });

  it("provider가 비어 있으면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(<SocialLoginButtons providers={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("className을 적용한다", () => {
    render(<SocialLoginButtons className="custom-class" />);

    expect(screen.getByLabelText("소셜 로그인")).toHaveClass("custom-class");
  });
});
