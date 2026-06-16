import { beforeEach, describe, expect, it, vi } from "vitest";

import { handleOAuthCallback, resolveOAuthCallbackProfile } from "../oauth-callback";

const mocks = vi.hoisted(() => ({
  verifyOAuthStateCookie: vi.fn(),

  getGoogleOAuthProfileByCode: vi.fn(),
  getNaverOAuthProfileByCode: vi.fn(),
  getKakaoOAuthProfileByCode: vi.fn(),

  findOrCreateOAuthUserService: vi.fn(),
  createAuthSession: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("../oauth-state", () => ({
  verifyOAuthStateCookie: mocks.verifyOAuthStateCookie,
}));

vi.mock("../google.provider", () => ({
  getGoogleOAuthProfileByCode: mocks.getGoogleOAuthProfileByCode,
}));

vi.mock("../naver.provider", () => ({
  getNaverOAuthProfileByCode: mocks.getNaverOAuthProfileByCode,
}));

vi.mock("../kakao.provider", () => ({
  getKakaoOAuthProfileByCode: mocks.getKakaoOAuthProfileByCode,
}));

vi.mock("@repo/domain/user/server", () => ({
  findOrCreateOAuthUserService: mocks.findOrCreateOAuthUserService,
}));

vi.mock("../../session", () => ({
  createAuthSession: mocks.createAuthSession,
}));

const OAUTH_PROFILE = {
  provider: "GOOGLE",
  providerUserId: "google-user-id",
  email: "user@example.com",
  name: "User",
  avatarUrl: "https://example.com/avatar.png",
} as const;

const USER_RESPONSE = {
  id: "user-id",
  email: "user@example.com",
  name: "User",
  avatarUrl: "https://example.com/avatar.png",
  nickname: "google_abcd",
  role: "USER",
  status: "ACTIVE",
  createdAt: "2026-01-01T00:00:00.000Z",
  lastLoginAt: null,
} as const;

const SESSION_RESULT = {
  token: "raw-session-token",
  sessionId: "session-id",
  expiresAt: new Date("2026-01-01T01:00:00.000Z"),
} as const;

describe("oauth-callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.verifyOAuthStateCookie.mockResolvedValue(true);

    mocks.getGoogleOAuthProfileByCode.mockResolvedValue(OAUTH_PROFILE);
    mocks.getNaverOAuthProfileByCode.mockResolvedValue({
      ...OAUTH_PROFILE,
      provider: "NAVER",
      providerUserId: "naver-user-id",
    });
    mocks.getKakaoOAuthProfileByCode.mockResolvedValue({
      ...OAUTH_PROFILE,
      provider: "KAKAO",
      providerUserId: "kakao-user-id",
    });

    mocks.findOrCreateOAuthUserService.mockResolvedValue({
      ok: true,
      data: USER_RESPONSE,
    });

    mocks.createAuthSession.mockResolvedValue(SESSION_RESULT);
  });

  it("code가 없으면 AUTH_OAUTH_MISSING_CODE 에러를 던진다", async () => {
    await expect(
      resolveOAuthCallbackProfile({
        providerId: "google",
        code: null,
        state: "state",
        appBaseUrl: "http://localhost:3000",
        callbackPath: "/api/auth/google/callback",
      }),
    ).rejects.toMatchObject({
      code: "AUTH_OAUTH_MISSING_CODE",
    });

    expect(mocks.verifyOAuthStateCookie).not.toHaveBeenCalled();
    expect(mocks.getGoogleOAuthProfileByCode).not.toHaveBeenCalled();
  });

  it("state 검증에 실패하면 AUTH_OAUTH_INVALID_STATE 에러를 던진다", async () => {
    mocks.verifyOAuthStateCookie.mockResolvedValue(false);

    await expect(
      resolveOAuthCallbackProfile({
        providerId: "google",
        code: "code",
        state: "invalid-state",
        appBaseUrl: "http://localhost:3000",
        callbackPath: "/api/auth/google/callback",
      }),
    ).rejects.toMatchObject({
      code: "AUTH_OAUTH_INVALID_STATE",
    });

    expect(mocks.verifyOAuthStateCookie).toHaveBeenCalledWith({
      providerId: "google",
      state: "invalid-state",
    });
    expect(mocks.getGoogleOAuthProfileByCode).not.toHaveBeenCalled();
  });

  it("state 값이 없으면 AUTH_OAUTH_INVALID_STATE 에러를 던진다", async () => {
    await expect(
      resolveOAuthCallbackProfile({
        providerId: "google",
        code: "code",
        state: null,
        appBaseUrl: "http://localhost:3000",
        callbackPath: "/api/auth/google/callback",
      }),
    ).rejects.toMatchObject({
      code: "AUTH_OAUTH_INVALID_STATE",
    });

    expect(mocks.getGoogleOAuthProfileByCode).not.toHaveBeenCalled();
  });

  it("Google callback profile을 조회한다", async () => {
    const result = await resolveOAuthCallbackProfile({
      providerId: "google",
      code: "google-code",
      state: "state",
      appBaseUrl: "http://localhost:3000",
      callbackPath: "/api/auth/google/callback",
    });

    expect(mocks.getGoogleOAuthProfileByCode).toHaveBeenCalledWith({
      code: "google-code",
      appBaseUrl: "http://localhost:3000",
      callbackPath: "/api/auth/google/callback",
    });
    expect(result).toEqual(OAUTH_PROFILE);
  });

  it("Naver callback profile을 조회한다", async () => {
    const result = await resolveOAuthCallbackProfile({
      providerId: "naver",
      code: "naver-code",
      state: "state",
      appBaseUrl: "http://localhost:3000",
      callbackPath: "/api/auth/naver/callback",
    });

    expect(mocks.getNaverOAuthProfileByCode).toHaveBeenCalledWith({
      code: "naver-code",
      state: "state",
      appBaseUrl: "http://localhost:3000",
      callbackPath: "/api/auth/naver/callback",
    });
    expect(result).toMatchObject({
      provider: "NAVER",
      providerUserId: "naver-user-id",
    });
  });

  it("Kakao callback profile을 조회한다", async () => {
    const result = await resolveOAuthCallbackProfile({
      providerId: "kakao",
      code: "kakao-code",
      state: "state",
      appBaseUrl: "http://localhost:3000",
      callbackPath: "/api/auth/kakao/callback",
    });

    expect(mocks.getKakaoOAuthProfileByCode).toHaveBeenCalledWith({
      code: "kakao-code",
      appBaseUrl: "http://localhost:3000",
      callbackPath: "/api/auth/kakao/callback",
    });
    expect(result).toMatchObject({
      provider: "KAKAO",
      providerUserId: "kakao-user-id",
    });
  });

  it("OAuth callback을 처리하고 사용자 세션을 생성한다", async () => {
    const result = await handleOAuthCallback({
      providerId: "google",
      code: "google-code",
      state: "state",
      appBaseUrl: "http://localhost:3000",
      callbackPath: "/api/auth/google/callback",
      ipAddress: "127.0.0.1",
      userAgent: "Vitest",
    });

    expect(mocks.findOrCreateOAuthUserService).toHaveBeenCalledWith({
      provider: "GOOGLE",
      providerUserId: "google-user-id",
      email: "user@example.com",
      name: "User",
      avatarUrl: "https://example.com/avatar.png",
    });

    expect(mocks.createAuthSession).toHaveBeenCalledWith({
      userId: "user-id",
      ipAddress: "127.0.0.1",
      userAgent: "Vitest",
    });

    expect(result).toEqual({
      userId: "user-id",
      sessionId: "session-id",
      expiresAt: SESSION_RESULT.expiresAt,
    });
  });

  it("사용자 생성 또는 연결에 실패하면 해당 AppError를 던진다", async () => {
    mocks.findOrCreateOAuthUserService.mockResolvedValue({
      ok: false,
      error: {
        code: "USER_OAUTH_LOGIN_FAILED",
        message: "소셜 로그인 처리 중 오류가 발생했습니다.",
      },
    });

    await expect(
      handleOAuthCallback({
        providerId: "google",
        code: "google-code",
        state: "state",
        appBaseUrl: "http://localhost:3000",
        callbackPath: "/api/auth/google/callback",
      }),
    ).rejects.toMatchObject({
      code: "USER_OAUTH_LOGIN_FAILED",
    });

    expect(mocks.createAuthSession).not.toHaveBeenCalled();
  });
});
