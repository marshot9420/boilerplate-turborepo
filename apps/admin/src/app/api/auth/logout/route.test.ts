import { beforeEach, describe, expect, it, vi } from "vitest";

import { URLS } from "@/constants";

import { POST } from "./route";

const adminAppUrl = vi.hoisted(() => "https://admin.example.com");

const revokeCurrentAuthSessionMock = vi.hoisted(() => vi.fn());

vi.mock("@repo/env/server", () => ({
  serverEnv: {
    ADMIN_APP_URL: adminAppUrl,
  },
}));

vi.mock("@repo/auth/server", () => ({
  revokeCurrentAuthSession: revokeCurrentAuthSessionMock,
}));

describe("Admin Logout Route", () => {
  beforeEach(() => {
    revokeCurrentAuthSessionMock.mockReset();
  });

  it("현재 인증 세션을 revoke한다", async () => {
    revokeCurrentAuthSessionMock.mockResolvedValue(undefined);

    await POST();

    expect(revokeCurrentAuthSessionMock).toHaveBeenCalledTimes(1);
  });

  it("로그인 페이지로 303 redirect한다", async () => {
    revokeCurrentAuthSessionMock.mockResolvedValue(undefined);

    const response = await POST();

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(`${adminAppUrl}${URLS.CLIENT.LOGIN}`);
  });

  it("세션 revoke 중 에러가 발생하면 에러를 그대로 전파한다", async () => {
    const error = new Error("revoke failed");

    revokeCurrentAuthSessionMock.mockRejectedValue(error);

    await expect(POST()).rejects.toThrow(error);
  });
});
