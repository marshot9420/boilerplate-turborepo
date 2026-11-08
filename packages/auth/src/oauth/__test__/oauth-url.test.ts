import { describe, expect, it, vi } from "vitest";

import { buildOAuthAuthorizeUrl, type BuildOAuthAuthorizeUrlParams } from "../oauth-url";

vi.mock("@repo/env/server", () => ({
  serverEnv: {
    GOOGLE_CLIENT_ID: "google-client-id",
    KAKAO_CLIENT_ID: "kakao-client-id",
    NAVER_CLIENT_ID: "naver-client-id",
  },
}));

const appBaseUrl = "https://web.example.com";
const state = "state+/=&?";

describe("buildOAuthAuthorizeUrl", () => {
  function authorizeUrl(
    providerId: BuildOAuthAuthorizeUrlParams["providerId"],
    scopes?: BuildOAuthAuthorizeUrlParams["scopes"],
  ): URL {
    return new URL(
      buildOAuthAuthorizeUrl({
        providerId,
        appBaseUrl,
        callbackPath: `/api/auth/${providerId}/callback`,
        state,
        scopes,
      }),
    );
  }

  it.each([
    { providerId: "google", scope: "openid email profile" },
    { providerId: "kakao", scope: "profile_nickname,profile_image,account_email" },
    { providerId: "naver", scope: null },
  ] as const)("$providerId 기본 Scope를 사용한다", ({ providerId, scope }) => {
    expect(authorizeUrl(providerId).searchParams.get("scope")).toBe(scope);
  });

  it.each([
    { providerId: "google", scope: "custom_first custom_second" },
    { providerId: "kakao", scope: "custom_first,custom_second" },
    { providerId: "naver", scope: "custom_first custom_second" },
  ] as const)("$providerId 명시 Scope를 제공자별 구분자로 연결한다", ({ providerId, scope }) => {
    expect(
      authorizeUrl(providerId, ["custom_first", "custom_second"]).searchParams.get("scope"),
    ).toBe(scope);
  });

  it("빈 배열로 기본 Scope를 재정의하면 scope를 생략한다", () => {
    expect(authorizeUrl("kakao", []).searchParams.has("scope")).toBe(false);
  });

  it("카카오 인가 요청에 Callback URL과 State를 보존한다", () => {
    const url = authorizeUrl("kakao");

    expect(`${url.origin}${url.pathname}`).toBe("https://kauth.kakao.com/oauth/authorize");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("client_id")).toBe("kakao-client-id");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "https://web.example.com/api/auth/kakao/callback",
    );
    expect(url.searchParams.get("state")).toBe(state);
  });
});
