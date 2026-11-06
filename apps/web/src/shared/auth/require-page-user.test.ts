import { beforeEach, describe, expect, it, vi } from "vitest";

import { URLS } from "@/constants";

import { requirePageUser } from "./require-page-user";

const authMock = vi.hoisted(() => ({
  getCurrentSession: vi.fn(),
}));

const redirectMock = vi.hoisted(() => vi.fn());

vi.mock("@repo/auth/server", () => authMock);

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

describe("requirePageUser", () => {
  const redirectError = new Error("NEXT_REDIRECT");

  beforeEach(() => {
    vi.resetAllMocks();
    redirectMock.mockImplementation(() => {
      throw redirectError;
    });
  });

  it("로그인한 사용자의 세션을 그대로 반환한다", async () => {
    const session = {
      id: "session-id",
      expiresAt: new Date("2026-12-31T00:00:00.000Z"),
      revokedAt: null,
      user: {
        id: "user-id",
        email: "user@example.com",
        name: "홍길동",
        avatarUrl: null,
        nickname: "gildong",
        role: "USER",
        status: "ACTIVE",
      },
    };

    authMock.getCurrentSession.mockResolvedValue(session);

    await expect(requirePageUser()).resolves.toBe(session);
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("세션이 없으면 로그인 페이지로 이동하고 실행을 중단한다", async () => {
    authMock.getCurrentSession.mockResolvedValue(null);

    await expect(requirePageUser()).rejects.toBe(redirectError);

    expect(redirectMock).toHaveBeenCalledWith(URLS.CLIENT.LOGIN);
  });

  it("세션 조회의 예상하지 못한 오류는 로그인 이동으로 숨기지 않고 전파한다", async () => {
    const sessionError = new Error("Session lookup failed");

    authMock.getCurrentSession.mockRejectedValue(sessionError);

    await expect(requirePageUser()).rejects.toBe(sessionError);

    expect(redirectMock).not.toHaveBeenCalled();
  });
});
