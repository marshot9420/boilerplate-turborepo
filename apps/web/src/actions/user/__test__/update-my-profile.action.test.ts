import { beforeEach, describe, expect, it, vi } from "vitest";

import { UpdateUserProfileRequest } from "@repo/domain/user/client";

import { updateMyProfileAction } from "../update-my-profile.action";

const authMock = vi.hoisted(() => ({
  requireUser: vi.fn(),
}));

const actionMock = vi.hoisted(() => ({
  createAction: vi.fn(),
}));

const cacheMock = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
}));

const userServiceMock = vi.hoisted(() => ({
  updateUserProfileService: vi.fn(),
}));

vi.mock("@repo/auth/server", () => authMock);

vi.mock("@repo/core/action", () => actionMock);

vi.mock("@repo/domain/user/server", () => userServiceMock);

vi.mock("next/cache", () => cacheMock);

vi.mock("@/constants", () => ({
  URLS: {
    CLIENT: {
      MY_PAGE: "/me",
    },
  },
}));

function createFormData() {
  const formData = new FormData();

  formData.set("name", "수정된 이름");
  formData.set("avatarUrl", "https://example.com/avatar.png");
  formData.set("nickname", "new_nickname");

  return formData;
}

describe("updateMyProfileAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("내 프로필 수정 Action을 생성하고 성공하면 마이페이지를 revalidate 한다", async () => {
    const formData = createFormData();

    const serviceResult = {
      ok: true,
      data: {
        id: "user-id",
        email: "user@example.com",
        name: "수정된 이름",
        avatarUrl: "https://example.com/avatar.png",
        nickname: "new_nickname",
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

    authMock.requireUser.mockResolvedValue({
      user: {
        id: "user-id",
      },
    });

    userServiceMock.updateUserProfileService.mockResolvedValue(serviceResult);

    actionMock.createAction.mockImplementation(async (params) => {
      const handlerResult = await params.handler({
        name: "수정된 이름",
        avatarUrl: "https://example.com/avatar.png",
        nickname: "new_nickname",
      });

      expect(handlerResult).toEqual(serviceResult);

      return actionResult;
    });

    const result = await updateMyProfileAction(null, formData);

    expect(authMock.requireUser).toHaveBeenCalledTimes(1);

    expect(actionMock.createAction).toHaveBeenCalledTimes(1);

    const createActionParams = actionMock.createAction.mock.calls[0]?.[0];

    expect(createActionParams).toMatchObject({
      actionName: "user.update_my_profile",
      schema: UpdateUserProfileRequest,
      formData,
      successMessage: "프로필이 수정되었습니다.",
    });

    expect(userServiceMock.updateUserProfileService).toHaveBeenCalledWith("user-id", {
      name: "수정된 이름",
      avatarUrl: "https://example.com/avatar.png",
      nickname: "new_nickname",
    });

    expect(cacheMock.revalidatePath).toHaveBeenCalledWith("/me");

    expect(result).toEqual(actionResult);
  });

  it("내 프로필 수정 Action이 실패하면 마이페이지를 revalidate 하지 않는다", async () => {
    const formData = createFormData();

    const actionResult = {
      ok: false,
      code: "USER_NICKNAME_DUPLICATED",
      message: "이미 사용 중인 닉네임입니다.",
      fieldErrors: {
        nickname: ["이미 사용 중인 닉네임입니다."],
      },
    };

    authMock.requireUser.mockResolvedValue({
      user: {
        id: "user-id",
      },
    });

    actionMock.createAction.mockResolvedValue(actionResult);

    const result = await updateMyProfileAction(null, formData);

    expect(authMock.requireUser).toHaveBeenCalledTimes(1);

    expect(actionMock.createAction).toHaveBeenCalledTimes(1);

    expect(cacheMock.revalidatePath).not.toHaveBeenCalled();

    expect(result).toEqual(actionResult);
  });

  it("인증에 실패하면 createAction을 호출하지 않는다", async () => {
    const formData = createFormData();
    const error = new Error("UNAUTHORIZED");

    authMock.requireUser.mockRejectedValue(error);

    await expect(updateMyProfileAction(null, formData)).rejects.toThrow("UNAUTHORIZED");

    expect(actionMock.createAction).not.toHaveBeenCalled();
    expect(userServiceMock.updateUserProfileService).not.toHaveBeenCalled();
    expect(cacheMock.revalidatePath).not.toHaveBeenCalled();
  });
});
