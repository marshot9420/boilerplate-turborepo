import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getKakaoOAuthProfile } from "../kakao.provider";

vi.mock("@repo/env/server", () => ({
  serverEnv: {},
}));

const KAKAO_ACCOUNT = {
  email: "user@example.com",
  is_email_valid: true,
  is_email_verified: true,
  profile: {
    nickname: "Kakao User",
    profile_image_url: "https://example.com/kakao.png",
  },
};

describe("getKakaoOAuthProfile", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("이메일 유효성과 인증 여부가 모두 true이면 OAuth 프로필을 반환한다", async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        id: 12345,
        kakao_account: KAKAO_ACCOUNT,
      }),
    );

    await expect(getKakaoOAuthProfile("test-access-token")).resolves.toEqual({
      provider: "KAKAO",
      providerUserId: "12345",
      email: "user@example.com",
      name: "Kakao User",
      avatarUrl: "https://example.com/kakao.png",
    });
  });

  it("동의하지 않은 선택 프로필 정보는 null로 반환한다", async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        id: 12345,
        kakao_account: {
          email: "user@example.com",
          is_email_valid: true,
          is_email_verified: true,
        },
      }),
    );

    await expect(getKakaoOAuthProfile("test-access-token")).resolves.toEqual({
      provider: "KAKAO",
      providerUserId: "12345",
      email: "user@example.com",
      name: null,
      avatarUrl: null,
    });
  });

  it.each([
    { flag: "is_email_valid", value: false },
    { flag: "is_email_valid", value: undefined },
    { flag: "is_email_valid", value: null },
    { flag: "is_email_valid", value: "true" },
    { flag: "is_email_verified", value: false },
    { flag: "is_email_verified", value: undefined },
    { flag: "is_email_verified", value: null },
    { flag: "is_email_verified", value: "true" },
  ])("$flag 값이 $value 이면 인증되지 않은 프로필을 거절한다", async ({ flag, value }) => {
    const kakaoAccount: Record<string, unknown> = {
      ...KAKAO_ACCOUNT,
      [flag]: value,
    };

    if (value === undefined) {
      delete kakaoAccount[flag];
    }

    fetchMock.mockResolvedValue(
      Response.json({
        id: 12345,
        kakao_account: kakaoAccount,
      }),
    );

    await expect(getKakaoOAuthProfile("test-access-token")).rejects.toMatchObject({
      code: "AUTH_OAUTH_INVALID_PROFILE_RESPONSE",
    });
  });
});
