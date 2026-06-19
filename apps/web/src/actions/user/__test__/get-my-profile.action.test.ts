import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireUser } from "@repo/auth/server";
import type { AppError } from "@repo/core/errors";
import { logger } from "@repo/core/logger";
import type { UserDetailResponse } from "@repo/domain/user/client";
import { getUserByIdService } from "@repo/domain/user/server";

import { getMyProfileAction } from "../get-my-profile.action";

vi.mock("@repo/auth/server", () => ({
  requireUser: vi.fn(),
}));

vi.mock("@repo/core/logger", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@repo/domain/user/server", () => ({
  getUserByIdService: vi.fn(),
}));

const USER_ID = "user-1";

function createUserDetailResponse(overrides: Partial<UserDetailResponse> = {}): UserDetailResponse {
  return {
    id: USER_ID,
    email: "user@example.com",
    name: "사용자",
    avatarUrl: "https://example.com/avatar.png",
    nickname: "user_nickname",
    role: "USER",
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    lastLoginAt: "2026-01-03T00:00:00.000Z",
    deletedAt: null,
    ...overrides,
  };
}

describe("getMyProfileAction", () => {
  const mockRequireUser = vi.mocked(requireUser);
  const mockGetUserByIdService = vi.mocked(getUserByIdService);
  const mockLoggerWarn = vi.mocked(logger.warn);
  const mockLoggerError = vi.mocked(logger.error);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("인증된 사용자의 내 정보를 조회한다", async () => {
    const user = createUserDetailResponse();

    mockRequireUser.mockResolvedValue({
      id: USER_ID,
    } as Awaited<ReturnType<typeof requireUser>>);

    mockGetUserByIdService.mockResolvedValue({
      ok: true,
      data: user,
    });

    const result = await getMyProfileAction();

    expect(mockRequireUser).toHaveBeenCalledTimes(1);
    expect(mockGetUserByIdService).toHaveBeenCalledTimes(1);
    expect(mockGetUserByIdService).toHaveBeenCalledWith(USER_ID);

    expect(result).toEqual({
      ok: true,
      data: user,
    });

    expect(mockLoggerWarn).not.toHaveBeenCalled();
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it("서비스가 실패하면 실패 ActionResult를 반환하고 warn 로그를 남긴다", async () => {
    const error = {
      code: "USER_NOT_FOUND",
      message: "사용자를 찾을 수 없습니다.",
    } satisfies AppError;

    mockRequireUser.mockResolvedValue({
      id: USER_ID,
    } as Awaited<ReturnType<typeof requireUser>>);

    mockGetUserByIdService.mockResolvedValue({
      ok: false,
      error,
    });

    const result = await getMyProfileAction();

    expect(result).toEqual({
      ok: false,
      code: error.code,
      message: error.message,
      fieldErrors: undefined,
    });

    expect(mockLoggerWarn).toHaveBeenCalledTimes(1);
    expect(mockLoggerWarn).toHaveBeenCalledWith("user.get_my_profile.failed", {
      userId: USER_ID,
      code: error.code,
      message: error.message,
    });

    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it("서비스 실패에 fieldErrors가 있으면 함께 반환한다", async () => {
    const error = {
      code: "USER_NICKNAME_DUPLICATED",
      message: "이미 사용 중인 닉네임입니다.",
      fieldErrors: {
        nickname: ["이미 사용 중인 닉네임입니다."],
      },
    } satisfies AppError;

    mockRequireUser.mockResolvedValue({
      id: USER_ID,
    } as Awaited<ReturnType<typeof requireUser>>);

    mockGetUserByIdService.mockResolvedValue({
      ok: false,
      error,
    });

    const result = await getMyProfileAction();

    expect(result).toEqual({
      ok: false,
      code: error.code,
      message: error.message,
      fieldErrors: error.fieldErrors,
    });
  });

  it("예상하지 못한 예외가 발생하면 INTERNAL_SERVER_ERROR를 반환하고 error 로그를 남긴다", async () => {
    const error = new Error("unexpected");

    mockRequireUser.mockRejectedValue(error);

    const result = await getMyProfileAction();

    expect(result).toEqual({
      ok: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "내 정보를 불러오는 중 오류가 발생했습니다.",
    });

    expect(mockGetUserByIdService).not.toHaveBeenCalled();

    expect(mockLoggerError).toHaveBeenCalledTimes(1);
    expect(mockLoggerError).toHaveBeenCalledWith("user.get_my_profile.unexpected_error", {
      error,
    });
  });
});
