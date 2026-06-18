import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AppError } from "@repo/core/errors";
import { logger } from "@repo/core/logger";
import type { ContentListResponse } from "@repo/domain/content/client";
import { getContentsService } from "@repo/domain/content/server";

import { getContentsAction } from "../get-contents.action";

vi.mock("@repo/domain/content/server", () => ({
  getContentsService: vi.fn(),
}));

vi.mock("@repo/core/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("getContentsAction", () => {
  const mockedGetContentsService = vi.mocked(getContentsService);
  const mockedLoggerWarn = vi.mocked(logger.warn);
  const mockedLoggerError = vi.mocked(logger.error);

  const contentListResponse = {
    items: [
      {
        id: "content-id",
        title: "샘플 콘텐츠",
        status: "PUBLISHED",
        authorId: "550e8400-e29b-41d4-a716-446655440000",
        createdAt: "2026-06-18T00:00:00.000Z",
        updatedAt: "2026-06-18T00:00:00.000Z",
      },
    ],
    meta: {
      page: 1,
      limit: 20,
      totalCount: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  } satisfies ContentListResponse;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("콘텐츠 목록을 조회하고 성공 ActionResult를 반환한다", async () => {
    mockedGetContentsService.mockResolvedValue({
      ok: true,
      data: contentListResponse,
    });

    const result = await getContentsAction({
      page: 1,
      limit: 20,
      authorId: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(mockedGetContentsService).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      authorId: "550e8400-e29b-41d4-a716-446655440000",
      status: "PUBLISHED",
    });

    expect(result).toEqual({
      ok: true,
      data: contentListResponse,
    });
  });

  it("요청 status와 무관하게 web 공개 목록은 PUBLISHED로 조회한다", async () => {
    mockedGetContentsService.mockResolvedValue({
      ok: true,
      data: contentListResponse,
    });

    await getContentsAction({
      status: "HIDDEN",
    });

    expect(mockedGetContentsService).toHaveBeenCalledWith({
      page: undefined,
      limit: undefined,
      authorId: undefined,
      status: "PUBLISHED",
    });
  });

  it("조회 조건 검증에 실패하면 VALIDATION_ERROR를 반환하고 service를 호출하지 않는다", async () => {
    const result = await getContentsAction({
      page: 0,
    });

    expect(mockedGetContentsService).not.toHaveBeenCalled();

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("검증 실패 케이스는 실패 ActionResult를 반환해야 합니다.");
    }

    expect(result.code).toBe("VALIDATION_ERROR");
    expect(result.message).toBe("조회 조건을 확인해 주세요.");
    expect(result.fieldErrors?.page).toEqual(expect.arrayContaining([expect.any(String)]));
  });

  it("service가 실패 Result를 반환하면 실패 ActionResult로 변환한다", async () => {
    const error = {
      code: "DATABASE_UNKNOWN_ERROR",
      message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
    } satisfies AppError;

    mockedGetContentsService.mockResolvedValue({
      ok: false,
      error,
    });

    const result = await getContentsAction();

    expect(mockedLoggerWarn).toHaveBeenCalledWith("content.get_list.failed", {
      code: error.code,
      message: error.message,
    });

    expect(result).toEqual({
      ok: false,
      code: error.code,
      message: error.message,
      fieldErrors: undefined,
    });
  });

  it("예상하지 못한 에러가 발생하면 INTERNAL_SERVER_ERROR를 반환한다", async () => {
    const error = new Error("unexpected error");

    mockedGetContentsService.mockRejectedValue(error);

    const result = await getContentsAction();

    expect(mockedLoggerError).toHaveBeenCalledWith("content.get_list.unexpected_error", {
      query: {},
      error,
    });

    expect(result).toEqual({
      ok: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "콘텐츠 목록을 불러오는 중 오류가 발생했습니다.",
    });
  });
});
