import { NextRequest } from "next/server";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { URLS } from "@/constants";

import { GET } from "./route";

const webAppUrl = vi.hoisted(() => "https://web.example.com");

const handleOAuthCallbackMock = vi.hoisted(() => vi.fn());
const parseOAuthProviderIdMock = vi.hoisted(() => vi.fn());

vi.mock("@/config/server-env", () => ({
  serverEnv: {
    WEB_APP_URL: webAppUrl,
  },
}));

vi.mock("@repo/auth/server", () => ({
  handleOAuthCallback: handleOAuthCallbackMock,
  parseOAuthProviderId: parseOAuthProviderIdMock,
}));

describe("Web OAuth Callback Route", () => {
  beforeEach(() => {
    handleOAuthCallbackMock.mockReset();
    parseOAuthProviderIdMock.mockReset();
  });

  it("유효하지 않은 provider면 로그인 페이지로 redirect한다", async () => {
    parseOAuthProviderIdMock.mockReturnValue(null);

    const request = new NextRequest(`${webAppUrl}/api/auth/unknown/callback?code=code&state=state`);

    const response = await GET(request, {
      params: Promise.resolve({
        provider: "unknown",
      }),
    });

    expect(parseOAuthProviderIdMock).toHaveBeenCalledWith("unknown");
    expect(handleOAuthCallbackMock).not.toHaveBeenCalled();

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      `${webAppUrl}${URLS.CLIENT.LOGIN}?error=invalid_oauth_provider`,
    );
  });

  it("callback 처리가 성공하면 마이페이지로 redirect한다", async () => {
    parseOAuthProviderIdMock.mockReturnValue("google");
    handleOAuthCallbackMock.mockResolvedValue(undefined);

    const request = new NextRequest(
      `${webAppUrl}/api/auth/google/callback?code=test-code&state=test-state`,
      {
        headers: {
          "x-forwarded-for": "203.0.113.10, 198.51.100.20",
          "user-agent": "vitest-user-agent",
        },
      },
    );

    const response = await GET(request, {
      params: Promise.resolve({
        provider: "google",
      }),
    });

    expect(parseOAuthProviderIdMock).toHaveBeenCalledWith("google");

    expect(handleOAuthCallbackMock).toHaveBeenCalledWith({
      providerId: "google",
      code: "test-code",
      state: "test-state",
      appBaseUrl: webAppUrl,
      callbackPath: URLS.API.AUTH.OAUTH_CALLBACK("google"),
      ipAddress: "203.0.113.10",
      userAgent: "vitest-user-agent",
    });

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`${webAppUrl}${URLS.CLIENT.MY_PAGE}`);
  });

  it("x-forwarded-for가 없으면 x-real-ip를 전달한다", async () => {
    parseOAuthProviderIdMock.mockReturnValue("naver");
    handleOAuthCallbackMock.mockResolvedValue(undefined);

    const request = new NextRequest(
      `${webAppUrl}/api/auth/naver/callback?code=test-code&state=test-state`,
      {
        headers: {
          "x-real-ip": "203.0.113.30",
          "user-agent": "vitest-user-agent",
        },
      },
    );

    await GET(request, {
      params: Promise.resolve({
        provider: "naver",
      }),
    });

    expect(handleOAuthCallbackMock).toHaveBeenCalledWith({
      providerId: "naver",
      code: "test-code",
      state: "test-state",
      appBaseUrl: webAppUrl,
      callbackPath: URLS.API.AUTH.OAUTH_CALLBACK("naver"),
      ipAddress: "203.0.113.30",
      userAgent: "vitest-user-agent",
    });
  });

  it("callback 처리 중 에러가 발생하면 로그인 실패 페이지로 redirect한다", async () => {
    parseOAuthProviderIdMock.mockReturnValue("kakao");
    handleOAuthCallbackMock.mockRejectedValue(new Error("OAuth failed"));

    const request = new NextRequest(
      `${webAppUrl}/api/auth/kakao/callback?code=test-code&state=test-state`,
    );

    const response = await GET(request, {
      params: Promise.resolve({
        provider: "kakao",
      }),
    });

    expect(handleOAuthCallbackMock).toHaveBeenCalled();

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      `${webAppUrl}${URLS.CLIENT.LOGIN}?error=oauth_failed`,
    );
  });

  it("code와 state가 없으면 null로 callback handler에 전달한다", async () => {
    parseOAuthProviderIdMock.mockReturnValue("google");
    handleOAuthCallbackMock.mockResolvedValue(undefined);

    const request = new NextRequest(`${webAppUrl}/api/auth/google/callback`);

    await GET(request, {
      params: Promise.resolve({
        provider: "google",
      }),
    });

    expect(handleOAuthCallbackMock).toHaveBeenCalledWith({
      providerId: "google",
      code: null,
      state: null,
      appBaseUrl: webAppUrl,
      callbackPath: URLS.API.AUTH.OAUTH_CALLBACK("google"),
      ipAddress: null,
      userAgent: null,
    });
  });
});
