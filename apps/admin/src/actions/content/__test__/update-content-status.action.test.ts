import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AppError } from "@repo/core/errors";

import { updateContentStatusAction } from "../update-content-status.action";

interface ExecuteFormActionParams<TInput> {
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
  executeFormAction: vi.fn(),
}));

const contentServiceMock = vi.hoisted(() => ({
  updateContentStatusService: vi.fn(),
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
    title: "테스트 제목",
    content: "테스트 본문",
    status: "HIDDEN",
    authorId: "user-id",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  };
}

describe("updateContentStatusAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("관리자를 actor로 사용해 콘텐츠 상태를 변경하고 CONTENTS 경로를 revalidate 한다", async () => {
    const formData = new FormData();
    const response = createContentDetailResponse();

    const serviceResult = {
      ok: true,
      data: response,
    };

    const actionResult = {
      ok: true,
      data: response,
      message: "콘텐츠 상태가 변경되었습니다.",
    };

    authMock.requireAdmin.mockResolvedValue(createAdminSession());
    contentServiceMock.updateContentStatusService.mockResolvedValue(serviceResult);

    actionMock.executeFormAction.mockImplementationOnce(
      async (
        params: ExecuteFormActionParams<{
          id: string;
          status: "PUBLISHED" | "HIDDEN";
        }>,
      ) => {
        await params.handler({
          id: "content-id",
          status: "HIDDEN",
        });

        return actionResult;
      },
    );

    const result = await updateContentStatusAction(null, formData);

    expect(authMock.requireAdmin).toHaveBeenCalledOnce();

    expect(actionMock.executeFormAction).toHaveBeenCalledWith(
      expect.objectContaining({
        actionName: "admin.content.update_status",
        formData,
        successMessage: "콘텐츠 상태가 변경되었습니다.",
      }),
    );

    expect(contentServiceMock.updateContentStatusService).toHaveBeenCalledWith(
      "content-id",
      {
        id: "admin-id",
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        status: "HIDDEN",
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
        status: ["Invalid option"],
      },
    };

    authMock.requireAdmin.mockResolvedValue(createAdminSession());
    actionMock.executeFormAction.mockResolvedValue(actionResult);

    const result = await updateContentStatusAction(null, formData);

    expect(nextCacheMock.revalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual(actionResult);
  });

  it("서비스가 실패 Result를 반환해도 executeFormAction의 결과를 그대로 반환한다", async () => {
    const formData = new FormData();

    const serviceError: AppError = {
      code: "CONTENT_FORBIDDEN",
      message: "콘텐츠 상태를 변경할 권한이 없습니다.",
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
    contentServiceMock.updateContentStatusService.mockResolvedValue(serviceResult);

    actionMock.executeFormAction.mockImplementationOnce(
      async (
        params: ExecuteFormActionParams<{
          id: string;
          status: "PUBLISHED" | "HIDDEN";
        }>,
      ) => {
        await params.handler({
          id: "content-id",
          status: "HIDDEN",
        });

        return actionResult;
      },
    );

    const result = await updateContentStatusAction(null, formData);

    expect(contentServiceMock.updateContentStatusService).toHaveBeenCalledWith(
      "content-id",
      {
        id: "admin-id",
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        status: "HIDDEN",
      },
    );

    expect(nextCacheMock.revalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual(actionResult);
  });
});
