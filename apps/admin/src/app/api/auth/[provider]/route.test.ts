import { NextRequest } from "next/server";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { URLS } from "@/constants";

import { GET } from "./route";

const adminAppUrl = vi.hoisted(() => "https://admin.example.com");

const createOAuthAuthorizeUrlMock = vi.hoisted(() => vi.fn());
const parseOAuthProviderIdMock = vi.hoisted(() => vi.fn());

vi.mock("@repo/env/server", () => ({
  serverEnv: {
    ADMIN_APP_URL: adminAppUrl,
  },
}));

vi.mock("@repo/auth/server", () => ({
  createOAuthAuthorizeUrl: createOAuthAuthorizeUrlMock,
  parseOAuthProviderId: parseOAuthProviderIdMock,
}));

describe("Admin OAuth Start Route", () => {
  beforeEach(() => {
    createOAuthAuthorizeUrlMock.mockReset();
    parseOAuthProviderIdMock.mockReset();
  });

  it("유효하지 않은 provider면 로그인 페이지로 redirect한다", async () => {
    parseOAuthProviderIdMock.mockReturnValue(null);

    const request = new NextRequest(`${adminAppUrl}/api/auth/unknown`);
    const response = await GET(request, {
      params: Promise.resolve({
        provider: "unknown",
      }),
    });

    expect(parseOAuthProviderIdMock).toHaveBeenCalledWith("unknown");
    expect(createOAuthAuthorizeUrlMock).not.toHaveBeenCalled();

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      `${adminAppUrl}${URLS.CLIENT.LOGIN}?error=invalid_oauth_provider`,
    );
  });

  it("유효한 provider면 OAuth authorize URL로 redirect한다", async () => {
    const authorizeUrl = "https://oauth.example.com/authorize";

    parseOAuthProviderIdMock.mockReturnValue("google");
    createOAuthAuthorizeUrlMock.mockResolvedValue(authorizeUrl);

    const request = new NextRequest(`${adminAppUrl}/api/auth/google`);
    const response = await GET(request, {
      params: Promise.resolve({
        provider: "google",
      }),
    });

    expect(parseOAuthProviderIdMock).toHaveBeenCalledWith("google");

    expect(createOAuthAuthorizeUrlMock).toHaveBeenCalledWith({
      providerId: "google",
      appBaseUrl: adminAppUrl,
      callbackPath: URLS.API.AUTH.OAUTH_CALLBACK("google"),
    });

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(authorizeUrl);
  });
});
