import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AppError } from "@repo/core/errors";

import { updateMyProfileAction } from "../update-my-profile.action";

interface CreateActionParams<TInput> {
  actionName: string;
  schema: unknown;
  formData: FormData;
  handler: (input: TInput) => Promise<unknown>;
  successMessage?: string;
}

const authMock = vi.hoisted(() => ({
  requireUser: vi.fn(),
}));

const actionMock = vi.hoisted(() => ({
  createAction: vi.fn(),
}));

const userServiceMock = vi.hoisted(() => ({
  updateUserProfileService: vi.fn(),
}));

const nextCacheMock = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@repo/auth/server", () => authMock);

vi.mock("@repo/core/action", () => actionMock);

vi.mock("@repo/domain/user/server", () => userServiceMock);

vi.mock("next/cache", () => nextCacheMock);

function createSession() {
  return {
    user: {
      id: "user-id",
      role: "USER",
      status: "ACTIVE",
    },
  };
}

describe("updateMyProfileAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("현재 사용자의 프로필을 수정하고 MY_PAGE를 revalidate 한다", async () => {
    const formData = new FormData();

    const serviceResult = {
      ok: true,
      data: {
        id: "user-id",
        email: "user@example.com",
        name: "테스트 사용자",
        avatarUrl: null,
        nickname: "tester",
        role: "USER",
        status: "ACTIVE",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
        lastLoginAt: null,
        deletedAt: null,
      },
    };

    const actionResult = {
      ok: true,
      data: serviceResult.data,
      message: "프로필이 수정되었습니다.",
    };

    authMock.requireUser.mockResolvedValue(createSession());
    userServiceMock.updateUserProfileService.mockResolvedValue(serviceResult);

    actionMock.createAction.mockImplementationOnce(
      async (
        params: CreateActionParams<{
          name?: string | null;
          avatarUrl?: string | null;
          nickname: string;
        }>,
      ) => {
        await params.handler({
          name: "테스트 사용자",
          avatarUrl: null,
          nickname: "tester",
        });

        return actionResult;
      },
    );

    const result = await updateMyProfileAction(null, formData);

    expect(authMock.requireUser).toHaveBeenCalledOnce();

    expect(actionMock.createAction).toHaveBeenCalledWith(
      expect.objectContaining({
        actionName: "user.update_my_profile",
        formData,
        successMessage: "프로필이 수정되었습니다.",
      }),
    );

    expect(userServiceMock.updateUserProfileService).toHaveBeenCalledWith("user-id", {
      name: "테스트 사용자",
      avatarUrl: null,
      nickname: "tester",
    });

    expect(nextCacheMock.revalidatePath).toHaveBeenCalledWith("/me");
    expect(result).toEqual(actionResult);
  });

  it("액션 결과가 실패하면 revalidatePath를 호출하지 않는다", async () => {
    const formData = new FormData();

    const actionResult = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        nickname: ["닉네임을 입력해 주세요."],
      },
    };

    authMock.requireUser.mockResolvedValue(createSession());
    actionMock.createAction.mockResolvedValue(actionResult);

    const result = await updateMyProfileAction(null, formData);

    expect(nextCacheMock.revalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual(actionResult);
  });

  it("서비스가 실패 Result를 반환해도 createAction의 결과를 그대로 반환한다", async () => {
    const formData = new FormData();

    const serviceError: AppError = {
      code: "USER_NICKNAME_DUPLICATED",
      message: "이미 사용 중인 닉네임입니다.",
      fieldErrors: {
        nickname: ["이미 사용 중인 닉네임입니다."],
      },
    };

    const serviceResult = {
      ok: false,
      error: serviceError,
    };

    const actionResult = {
      ok: false,
      code: serviceError.code,
      message: serviceError.message,
      fieldErrors: serviceError.fieldErrors,
    };

    authMock.requireUser.mockResolvedValue(createSession());
    userServiceMock.updateUserProfileService.mockResolvedValue(serviceResult);

    actionMock.createAction.mockImplementationOnce(
      async (
        params: CreateActionParams<{
          name?: string | null;
          avatarUrl?: string | null;
          nickname: string;
        }>,
      ) => {
        await params.handler({
          name: "테스트 사용자",
          avatarUrl: null,
          nickname: "duplicated",
        });

        return actionResult;
      },
    );

    const result = await updateMyProfileAction(null, formData);

    expect(userServiceMock.updateUserProfileService).toHaveBeenCalledWith("user-id", {
      name: "테스트 사용자",
      avatarUrl: null,
      nickname: "duplicated",
    });

    expect(nextCacheMock.revalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual(actionResult);
  });
});
