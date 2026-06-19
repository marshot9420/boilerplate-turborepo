import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AuthSession } from "@repo/auth/server";
import { getCurrentSession } from "@repo/auth/server";
import { logger } from "@repo/core/logger";
import type { ContentDetailResponse } from "@repo/domain/content/client";
import { getContentByIdService } from "@repo/domain/content/server";

import { getContentByIdAction } from "../get-content-by-id.action";

vi.mock("@repo/auth/server", () => ({
  getCurrentSession: vi.fn(),
}));

vi.mock("@repo/core/logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock("@repo/domain/content/server", () => ({
  getContentByIdService: vi.fn(),
}));

const mockedGetCurrentSession = vi.mocked(getCurrentSession);
const mockedGetContentByIdService = vi.mocked(getContentByIdService);
const mockedLoggerWarn = vi.mocked(logger.warn);
const mockedLoggerError = vi.mocked(logger.error);

const contentId = "550e8400-e29b-41d4-a716-446655440000";

const contentDetail: ContentDetailResponse = {
  id: contentId,
  title: "콘텐츠 상세 제목",
  content: "콘텐츠 상세 본문입니다.",
  status: "PUBLISHED",
  authorId: "author-id",
  createdAt: "2026-06-18T10:00:00.000Z",
  updatedAt: "2026-06-18T12:00:00.000Z",
};

function createSession(): AuthSession {
  return {
    id: "session-id",
    expiresAt: new Date("2026-12-31T00:00:00.000Z"),
    revokedAt: null,
    user: {
      id: "user-id",
      email: "user@example.com",
      name: "사용자",
      avatarUrl: null,
      nickname: "user",
      role: "USER",
      status: "ACTIVE",
    },
  };
}

describe("getContentByIdAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetCurrentSession.mockResolvedValue(null);
  });

  it("비로그인 상태에서 콘텐츠 상세 조회에 성공하면 actor 없이 성공 ActionResult를 반환한다", async () => {
    mockedGetContentByIdService.mockResolvedValue({
      ok: true,
      data: contentDetail,
    });

    const result = await getContentByIdAction(contentId);

    expect(mockedGetCurrentSession).toHaveBeenCalledOnce();
    expect(mockedGetContentByIdService).toHaveBeenCalledWith(contentId, null);

    expect(result).toEqual({
      ok: true,
      data: contentDetail,
    });
  });

  it("로그인 상태에서 콘텐츠 상세 조회에 성공하면 현재 사용자를 actor로 전달한다", async () => {
    mockedGetCurrentSession.mockResolvedValue(createSession());

    mockedGetContentByIdService.mockResolvedValue({
      ok: true,
      data: contentDetail,
    });

    const result = await getContentByIdAction(contentId);

    expect(mockedGetContentByIdService).toHaveBeenCalledWith(contentId, {
      id: "user-id",
      role: "USER",
      status: "ACTIVE",
    });

    expect(result).toEqual({
      ok: true,
      data: contentDetail,
    });
  });

  it("콘텐츠 식별자가 올바르지 않으면 validation error를 반환한다", async () => {
    const result = await getContentByIdAction("invalid-content-id");

    expect(mockedGetCurrentSession).not.toHaveBeenCalled();
    expect(mockedGetContentByIdService).not.toHaveBeenCalled();

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("Expected validation failure result.");
    }

    expect(result.code).toBe("VALIDATION_ERROR");
    expect(result.message).toBe("콘텐츠 식별자를 확인해 주세요.");
    expect(result.fieldErrors?.id).toBeDefined();
  });

  it("서비스가 실패 Result를 반환하면 실패 ActionResult를 반환하고 warn 로그를 남긴다", async () => {
    mockedGetContentByIdService.mockResolvedValue({
      ok: false,
      error: {
        code: "CONTENT_NOT_FOUND",
        message: "콘텐츠를 찾을 수 없습니다.",
      },
    });

    const result = await getContentByIdAction(contentId);

    expect(result).toEqual({
      ok: false,
      code: "CONTENT_NOT_FOUND",
      message: "콘텐츠를 찾을 수 없습니다.",
      fieldErrors: undefined,
    });

    expect(mockedLoggerWarn).toHaveBeenCalledWith("content.get_by_id.failed", {
      contentId,
      actorId: undefined,
      actorRole: undefined,
      code: "CONTENT_NOT_FOUND",
      message: "콘텐츠를 찾을 수 없습니다.",
    });
  });

  it("서비스 실패 Result의 fieldErrors가 있으면 함께 반환한다", async () => {
    mockedGetCurrentSession.mockResolvedValue(createSession());

    mockedGetContentByIdService.mockResolvedValue({
      ok: false,
      error: {
        code: "CONTENT_INVALID_STATE",
        message: "콘텐츠 상태가 올바르지 않습니다.",
        fieldErrors: {
          id: ["콘텐츠 식별자를 확인해 주세요."],
        },
      },
    });

    const result = await getContentByIdAction(contentId);

    expect(result).toEqual({
      ok: false,
      code: "CONTENT_INVALID_STATE",
      message: "콘텐츠 상태가 올바르지 않습니다.",
      fieldErrors: {
        id: ["콘텐츠 식별자를 확인해 주세요."],
      },
    });

    expect(mockedLoggerWarn).toHaveBeenCalledWith("content.get_by_id.failed", {
      contentId,
      actorId: "user-id",
      actorRole: "USER",
      code: "CONTENT_INVALID_STATE",
      message: "콘텐츠 상태가 올바르지 않습니다.",
    });
  });

  it("예상하지 못한 에러가 발생하면 internal server error를 반환하고 error 로그를 남긴다", async () => {
    const error = new Error("unexpected error");

    mockedGetContentByIdService.mockRejectedValue(error);

    const result = await getContentByIdAction(contentId);

    expect(result).toEqual({
      ok: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "콘텐츠를 불러오는 중 오류가 발생했습니다.",
    });

    expect(mockedLoggerError).toHaveBeenCalledWith("content.get_by_id.unexpected_error", {
      contentId,
      error,
    });
  });
});
