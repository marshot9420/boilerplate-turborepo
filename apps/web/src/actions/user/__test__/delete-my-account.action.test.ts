import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteMyAccountAction } from "../delete-my-account.action";

const redirectMock = vi.hoisted(() => vi.fn());

const authMock = vi.hoisted(() => ({
  requireUser: vi.fn(),
  revokeCurrentAuthSession: vi.fn(),
}));

const userServiceMock = vi.hoisted(() => ({
  softDeleteUserService: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@repo/auth/server", () => authMock);

vi.mock("@repo/domain/user/server", () => userServiceMock);

vi.mock("@/constants", () => ({
  URLS: {
    CLIENT: {
      LOGIN: "/login",
    },
  },
}));

function createFormData(params: { confirmation?: string } = {}) {
  const formData = new FormData();

  if (params.confirmation !== undefined) {
    formData.set("confirmation", params.confirmation);
  }

  return formData;
}

function createMockSession() {
  return {
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
}

describe("deleteMyAccountAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("확인 문구가 올바르지 않으면 validation 실패 Result를 반환한다", async () => {
    authMock.requireUser.mockResolvedValue(createMockSession());

    const result = await deleteMyAccountAction(
      null,
      createFormData({
        confirmation: "탈퇴",
      }),
    );

    expect(result).toEqual({
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        confirmation: ["회원탈퇴를 입력해 주세요."],
      },
    });

    expect(userServiceMock.softDeleteUserService).not.toHaveBeenCalled();
    expect(authMock.revokeCurrentAuthSession).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("회원 탈퇴 서비스가 실패하면 실패 Result를 반환한다", async () => {
    authMock.requireUser.mockResolvedValue(createMockSession());

    userServiceMock.softDeleteUserService.mockResolvedValue({
      ok: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "사용자를 찾을 수 없습니다.",
      },
    });

    const result = await deleteMyAccountAction(
      null,
      createFormData({
        confirmation: "회원탈퇴",
      }),
    );

    expect(userServiceMock.softDeleteUserService).toHaveBeenCalledWith("user-id");

    expect(result).toEqual({
      ok: false,
      code: "USER_NOT_FOUND",
      message: "사용자를 찾을 수 없습니다.",
      fieldErrors: undefined,
    });

    expect(authMock.revokeCurrentAuthSession).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("회원 탈퇴에 성공하면 현재 세션을 폐기하고 로그인 페이지로 이동한다", async () => {
    authMock.requireUser.mockResolvedValue(createMockSession());

    userServiceMock.softDeleteUserService.mockResolvedValue({
      ok: true,
      data: {
        id: "user-id",
        email: "user@example.com",
        name: "홍길동",
        avatarUrl: null,
        nickname: "gildong",
        role: "USER",
        status: "DELETED",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
        lastLoginAt: null,
        deletedAt: "2026-01-03T00:00:00.000Z",
      },
    });

    const result = await deleteMyAccountAction(
      null,
      createFormData({
        confirmation: "회원탈퇴",
      }),
    );

    expect(userServiceMock.softDeleteUserService).toHaveBeenCalledWith("user-id");
    expect(authMock.revokeCurrentAuthSession).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith("/login");

    expect(result).toBeUndefined();
  });
});
