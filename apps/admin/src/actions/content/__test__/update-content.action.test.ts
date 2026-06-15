import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AppError } from "@repo/core/errors";

import { updateContentAction } from "../update-content.action";

interface CreateActionParams<TInput> {
  actionName: string;
  schema: unknown;
  formData: FormData;
  handler: (input: TInput) => Promise<unknown>;
  successMessage?: string;
}

const authMock = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
}));

const actionMock = vi.hoisted(() => ({
  createAction: vi.fn(),
}));

const contentServiceMock = vi.hoisted(() => ({
  updateContentService: vi.fn(),
}));

const nextCacheMock = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@repo/auth/server", () => authMock);

vi.mock("@repo/core/action", () => actionMock);

vi.mock("@repo/domain/content/server", () => contentServiceMock);

vi.mock("next/cache", () => nextCacheMock);

function createAdminSession() {
  return {
    user: {
      id: "admin-id",
      role: "ADMIN",
      status: "ACTIVE",
    },
  };
}

function createContentDetailResponse() {
  return {
    id: "content-id",
    title: "수정된 제목",
    content: "수정된 본문",
    status: "PUBLISHED",
    authorId: "user-id",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  };
}

describe("updateContentAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("관리자를 actor로 사용해 콘텐츠를 수정하고 CONTENTS 경로를 revalidate 한다", async () => {
    const formData = new FormData();
    const response = createContentDetailResponse();

    const serviceResult = {
      ok: true,
      data: response,
    };

    const actionResult = {
      ok: true,
      data: response,
      message: "콘텐츠가 수정되었습니다.",
    };

    authMock.requireAdmin.mockResolvedValue(createAdminSession());
    contentServiceMock.updateContentService.mockResolvedValue(serviceResult);

    actionMock.createAction.mockImplementationOnce(
      async (
        params: CreateActionParams<{
          id: string;
          title?: string;
          content?: string;
        }>,
      ) => {
        await params.handler({
          id: "content-id",
          title: "수정된 제목",
          content: "수정된 본문",
        });

        return actionResult;
      },
    );

    const result = await updateContentAction(null, formData);

    expect(authMock.requireAdmin).toHaveBeenCalledOnce();

    expect(actionMock.createAction).toHaveBeenCalledWith(
      expect.objectContaining({
        actionName: "admin.content.update",
        formData,
        successMessage: "콘텐츠가 수정되었습니다.",
      }),
    );

    expect(contentServiceMock.updateContentService).toHaveBeenCalledWith(
      "content-id",
      {
        id: "admin-id",
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        title: "수정된 제목",
        content: "수정된 본문",
      },
    );

    expect(nextCacheMock.revalidatePath).toHaveBeenCalledWith("/contents");
    expect(result).toEqual(actionResult);
  });

  it("액션 결과가 실패하면 revalidatePath를 호출하지 않는다", async () => {
    const formData = new FormData();

    const actionResult = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        content: ["수정할 내용을 입력해 주세요."],
      },
    };

    authMock.requireAdmin.mockResolvedValue(createAdminSession());
    actionMock.createAction.mockResolvedValue(actionResult);

    const result = await updateContentAction(null, formData);

    expect(nextCacheMock.revalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual(actionResult);
  });

  it("서비스가 실패 Result를 반환해도 createAction의 결과를 그대로 반환한다", async () => {
    const formData = new FormData();

    const serviceError: AppError = {
      code: "CONTENT_DELETED",
      message: "삭제된 콘텐츠입니다.",
    };

    const serviceResult = {
      ok: false,
      error: serviceError,
    };

    const actionResult = {
      ok: false,
      code: serviceError.code,
      message: serviceError.message,
    };

    authMock.requireAdmin.mockResolvedValue(createAdminSession());
    contentServiceMock.updateContentService.mockResolvedValue(serviceResult);

    actionMock.createAction.mockImplementationOnce(
      async (
        params: CreateActionParams<{
          id: string;
          title?: string;
          content?: string;
        }>,
      ) => {
        await params.handler({
          id: "content-id",
          title: "수정된 제목",
        });

        return actionResult;
      },
    );

    const result = await updateContentAction(null, formData);

    expect(contentServiceMock.updateContentService).toHaveBeenCalledWith(
      "content-id",
      {
        id: "admin-id",
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        title: "수정된 제목",
      },
    );

    expect(nextCacheMock.revalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual(actionResult);
  });
});
