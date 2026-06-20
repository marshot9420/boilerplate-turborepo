import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAdmin } from "@repo/auth/server";
import type { ContentListResponse } from "@repo/domain/content/client";
import { getContentsService } from "@repo/domain/content/server";

import { getContentsAction } from "../get-contents.action";

vi.mock("@repo/auth/server", () => ({
  requireAdmin: vi.fn(),
}));

vi.mock("@repo/domain/content/server", () => ({
  getContentsService: vi.fn(),
}));

describe("getContentsAction", () => {
  const adminSession = {
    user: {
      id: "admin-user-id",
      role: "ADMIN",
      status: "ACTIVE",
    },
  } as Awaited<ReturnType<typeof requireAdmin>>;

  const contentListResponse: ContentListResponse = {
    items: [
      {
        id: "content-id",
        title: "테스트 콘텐츠",
        status: "PUBLISHED",
        authorId: "author-id",
        createdAt: "2026-06-20T00:00:00.000Z",
        updatedAt: "2026-06-20T00:00:00.000Z",
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
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(requireAdmin).mockResolvedValue(adminSession);
  });

  it("관리자 인증 후 콘텐츠 목록을 조회한다", async () => {
    vi.mocked(getContentsService).mockResolvedValue({
      ok: true,
      data: contentListResponse,
    });

    const result = await getContentsAction();

    expect(requireAdmin).toHaveBeenCalledTimes(1);
    expect(getContentsService).toHaveBeenCalledTimes(1);
    expect(getContentsService).toHaveBeenCalledWith({});

    expect(result).toEqual({
      ok: true,
      data: contentListResponse,
    });
  });

  it("검색 조건을 검증한 뒤 서비스에 전달한다", async () => {
    vi.mocked(getContentsService).mockResolvedValue({
      ok: true,
      data: contentListResponse,
    });

    const result = await getContentsAction({
      page: "2",
      limit: "10",
      status: "HIDDEN",
      authorId: "00000000-0000-4000-8000-000000000001",
      sort: "CREATED_AT",
      order: "desc",
    });

    expect(result.ok).toBe(true);

    expect(getContentsService).toHaveBeenCalledTimes(1);
    expect(getContentsService).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      status: "HIDDEN",
      authorId: "00000000-0000-4000-8000-000000000001",
      sort: "CREATED_AT",
      order: "desc",
    });
  });

  it("검색 조건이 올바르지 않으면 검증 실패 결과를 반환한다", async () => {
    const result = await getContentsAction({
      page: "0",
      limit: "101",
      status: "INVALID_STATUS",
    });

    expect(requireAdmin).toHaveBeenCalledTimes(1);
    expect(getContentsService).not.toHaveBeenCalled();

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.code).toBe("VALIDATION_ERROR");
      expect(result.message).toBe("콘텐츠 목록 조회 조건을 확인해 주세요.");
      expect(result.fieldErrors?.page).toBeDefined();
      expect(result.fieldErrors?.limit).toBeDefined();
      expect(result.fieldErrors?.status).toBeDefined();
    }
  });

  it("서비스가 실패하면 실패 결과를 반환한다", async () => {
    vi.mocked(getContentsService).mockResolvedValue({
      ok: false,
      error: {
        code: "DATABASE_UNKNOWN_ERROR",
        message: "콘텐츠 목록 조회 중 오류가 발생했습니다.",
      },
    });

    const result = await getContentsAction({
      page: "1",
      limit: "20",
    });

    expect(requireAdmin).toHaveBeenCalledTimes(1);
    expect(getContentsService).toHaveBeenCalledTimes(1);
    expect(getContentsService).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
    });

    expect(result).toEqual({
      ok: false,
      code: "DATABASE_UNKNOWN_ERROR",
      message: "콘텐츠 목록 조회 중 오류가 발생했습니다.",
      fieldErrors: undefined,
    });
  });

  it("관리자 인증에 실패하면 예외를 전파하고 목록 조회를 실행하지 않는다", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new Error("UNAUTHORIZED"));

    await expect(getContentsAction()).rejects.toThrow("UNAUTHORIZED");

    expect(requireAdmin).toHaveBeenCalledTimes(1);
    expect(getContentsService).not.toHaveBeenCalled();
  });

  it("빈 문자열 검색 조건은 선택하지 않은 조건으로 처리한다", async () => {
    vi.mocked(getContentsService).mockResolvedValue({
      ok: true,
      data: contentListResponse,
    });

    const result = await getContentsAction({
      page: "",
      limit: "",
      status: "",
      authorId: "",
      sort: "",
      order: "",
    });

    expect(result.ok).toBe(true);
    expect(getContentsService).toHaveBeenCalledTimes(1);
  });
});
