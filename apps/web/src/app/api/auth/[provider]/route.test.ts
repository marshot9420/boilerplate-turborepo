import { NextRequest } from "next/server";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { URLS } from "@/constants";

import { GET } from "./route";

const webAppUrl = vi.hoisted(() => "https://web.example.com");

const setCookieMock = vi.hoisted(() => vi.fn());

vi.mock("@/config/server-env", () => ({
  serverEnv: {
    WEB_APP_URL: webAppUrl,
  },
}));

vi.mock("@repo/env/server", () => ({
  serverEnv: {
    AUTH_SESSION_COOKIE_NAME: "oauth_route_test",
    GOOGLE_CLIENT_ID: "google-client-id",
    KAKAO_CLIENT_ID: "kakao-client-id",
    NODE_ENV: "test",
  },
}));

vi.mock("@repo/database/client", () => ({ prisma: {} }));

vi.mock("next/headers", () => ({
  cookies: async () => ({ set: setCookieMock }),
}));

describe("Web OAuth Start Route", () => {
  beforeEach(() => {
    setCookieMock.mockClear();
  });

  it("유효하지 않은 provider면 로그인 페이지로 redirect한다", async () => {
    const request = new NextRequest(`${webAppUrl}/api/auth/unknown`);

    const response = await GET(request, {
      params: Promise.resolve({
        provider: "unknown",
      }),
    });

    expect(setCookieMock).not.toHaveBeenCalled();
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      `${webAppUrl}${URLS.CLIENT.LOGIN}?error=invalid_oauth_provider`,
    );
  });

  it.each([
    {
      providerId: "google",
      endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      scope: "openid email profile",
    },
    {
      providerId: "kakao",
      endpoint: "https://kauth.kakao.com/oauth/authorize",
      scope: "profile_nickname,profile_image,account_email",
    },
  ])(
    "$providerId 인가 URL에 Web Callback과 쿠키에 저장한 State를 전달한다",
    async ({ providerId, endpoint, scope }) => {
      const request = new NextRequest(`${webAppUrl}/api/auth/${providerId}`);
      const response = await GET(request, {
        params: Promise.resolve({ provider: providerId }),
      });

      expect(response.status).toBe(307);
      const authorizeUrl = new URL(response.headers.get("location") ?? "");
      const state = authorizeUrl.searchParams.get("state");

      expect(`${authorizeUrl.origin}${authorizeUrl.pathname}`).toBe(endpoint);
      expect(authorizeUrl.searchParams.get("scope")).toBe(scope);
      expect(authorizeUrl.searchParams.get("redirect_uri")).toBe(
        `${webAppUrl}/api/auth/${providerId}/callback`,
      );
      expect(state).toBeTruthy();
      expect(setCookieMock).toHaveBeenCalledWith(
        `oauth_route_test_${providerId}_oauth_state`,
        state,
        expect.objectContaining({ httpOnly: true }),
      );
    },
  );
});
