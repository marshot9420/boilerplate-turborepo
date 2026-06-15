import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AppError } from "@repo/core/errors";

import { createContentAction } from "../create-content.action";

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

const contentServiceMock = vi.hoisted(() => ({
  createContentService: vi.fn(),
}));

const nextCacheMock = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@repo/auth/server", () => authMock);

vi.mock("@repo/core/action", () => actionMock);

vi.mock("@repo/domain/content/server", () => contentServiceMock);

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

function createContentDetailResponse() {
  return {
    id: "content-id",
    title: "테스트 제목",
    content: "테스트 본문",
    status: "PUBLISHED",
    authorId: "user-id",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  };
}

describe("createContentAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("현재 사용자를 actor로 사용해 콘텐츠를 생성하고 HOME, MY_PAGE를 revalidate 한다", async () => {
    const formData = new FormData();

    const response = createContentDetailResponse();

    const serviceResult = {
      ok: true,
      data: response,
    };

    const actionResult = {
      ok: true,
      data: response,
      message: "콘텐츠가 생성되었습니다.",
    };

    authMock.requireUser.mockResolvedValue(createSession());
    contentServiceMock.createContentService.mockResolvedValue(serviceResult);

    actionMock.createAction.mockImplementationOnce(
      async (
        params: CreateActionParams<{
          title: string;
          content: string;
        }>,
      ) => {
        await params.handler({
          title: "테스트 제목",
          content: "테스트 본문",
        });

        return actionResult;
      },
    );

    const result = await createContentAction(null, formData);

    expect(authMock.requireUser).toHaveBeenCalledOnce();

    expect(actionMock.createAction).toHaveBeenCalledWith(
      expect.objectContaining({
        actionName: "content.create",
        formData,
        successMessage: "콘텐츠가 생성되었습니다.",
      }),
    );

    expect(contentServiceMock.createContentService).toHaveBeenCalledWith(
      {
        id: "user-id",
        role: "USER",
        status: "ACTIVE",
      },
      {
        title: "테스트 제목",
        content: "테스트 본문",
      },
    );

    expect(nextCacheMock.revalidatePath).toHaveBeenCalledWith("/");
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
        title: ["제목을 입력해 주세요."],
      },
    };

    authMock.requireUser.mockResolvedValue(createSession());
    actionMock.createAction.mockResolvedValue(actionResult);

    const result = await createContentAction(null, formData);

    expect(nextCacheMock.revalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual(actionResult);
  });

  it("서비스가 실패 Result를 반환해도 createAction의 결과를 그대로 반환한다", async () => {
    const formData = new FormData();

    const serviceError: AppError = {
      code: "CONTENT_FORBIDDEN",
      message: "콘텐츠를 생성할 권한이 없습니다.",
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

    authMock.requireUser.mockResolvedValue(createSession());
    contentServiceMock.createContentService.mockResolvedValue(serviceResult);

    actionMock.createAction.mockImplementationOnce(
      async (
        params: CreateActionParams<{
          title: string;
          content: string;
        }>,
      ) => {
        await params.handler({
          title: "테스트 제목",
          content: "테스트 본문",
        });

        return actionResult;
      },
    );

    const result = await createContentAction(null, formData);

    expect(contentServiceMock.createContentService).toHaveBeenCalledOnce();
    expect(nextCacheMock.revalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual(actionResult);
  });
});
