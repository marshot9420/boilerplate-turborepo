import { describe, expect, it } from "vitest";

import {
  getOAuthProviderConfig,
  isOAuthProviderId,
  parseOAuthProviderId,
  toOAuthAuthProvider,
} from "../oauth-provider";

describe("oauth-provider", () => {
  it("지원하는 OAuth provider id를 판별한다", () => {
    expect(isOAuthProviderId("google")).toBe(true);
    expect(isOAuthProviderId("naver")).toBe(true);
    expect(isOAuthProviderId("kakao")).toBe(true);
  });

  it("지원하지 않는 OAuth provider id는 false를 반환한다", () => {
    expect(isOAuthProviderId("github")).toBe(false);
    expect(isOAuthProviderId("")).toBe(false);
  });

  it("문자열 provider 값을 파싱한다", () => {
    expect(parseOAuthProviderId("google")).toBe("google");
    expect(parseOAuthProviderId("naver")).toBe("naver");
    expect(parseOAuthProviderId("kakao")).toBe("kakao");
  });

  it("잘못된 provider 값은 null을 반환한다", () => {
    expect(parseOAuthProviderId(undefined)).toBeNull();
    expect(parseOAuthProviderId("github")).toBeNull();
    expect(parseOAuthProviderId(["google"])).toBeNull();
  });

  it("provider 설정을 반환한다", () => {
    expect(getOAuthProviderConfig("google")).toEqual({
      id: "google",
      authProvider: "GOOGLE",
      label: "Google",
    });

    expect(getOAuthProviderConfig("naver")).toEqual({
      id: "naver",
      authProvider: "NAVER",
      label: "Naver",
    });

    expect(getOAuthProviderConfig("kakao")).toEqual({
      id: "kakao",
      authProvider: "KAKAO",
      label: "Kakao",
    });
  });

  it("OAuth provider id를 Prisma AuthProvider 값으로 변환한다", () => {
    expect(toOAuthAuthProvider("google")).toBe("GOOGLE");
    expect(toOAuthAuthProvider("naver")).toBe("NAVER");
    expect(toOAuthAuthProvider("kakao")).toBe("KAKAO");
  });
});
