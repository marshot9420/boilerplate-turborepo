import type { Content } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AppError } from "@repo/core/errors";

import { type ContentPermissionActor } from "../content.permission";
import {
  createContentService,
  getContentByIdService,
  getContentsService,
  softDeleteContentService,
  updateContentService,
  updateContentStatusService,
} from "../content.service";

const repositoryMock = vi.hoisted(() => ({
  countContentsRepository: vi.fn(),
  createContentRepository: vi.fn(),
  findContentByIdRepository: vi.fn(),
  findContentsRepository: vi.fn(),
  softDeleteContentRepository: vi.fn(),
  updateContentRepository: vi.fn(),
}));

const loggerMock = vi.hoisted(() => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

vi.mock("@repo/database/content", () => repositoryMock);

vi.mock("@repo/core/logger", () => ({
  logger: loggerMock,
}));

function createActor(overrides: Partial<ContentPermissionActor> = {}): ContentPermissionActor {
  return {
    id: "user-id",
    role: "USER",
    status: "ACTIVE",
    ...overrides,
  };
}

function createMockContent(overrides: Partial<Content> = {}): Content {
  return {
    id: "content-id",
    title: "테스트 제목",
    content: "테스트 본문",
    status: "PUBLISHED",
    authorId: "user-id",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    ...overrides,
  };
}

function createDatabaseError(): AppError {
  return {
    code: "DATABASE_UNKNOWN_ERROR",
    message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
  };
}

describe("content.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createContentService", () => {
    it("ACTIVE 사용자가 콘텐츠를 생성하고 ContentDetailResponse를 반환한다", async () => {
      const actor = createActor();
      const createdContent = createMockContent();

      repositoryMock.createContentRepository.mockResolvedValue(createdContent);

      const result = await createContentService(actor, {
        title: "테스트 제목",
        content: "테스트 본문",
      });

      expect(repositoryMock.createContentRepository).toHaveBeenCalledWith({
        title: "테스트 제목",
        content: "테스트 본문",
        author: {
          connect: {
            id: "user-id",
          },
        },
      });

      expect(result).toEqual({
        ok: true,
        data: {
          id: "content-id",
          title: "테스트 제목",
          content: "테스트 본문",
          status: "PUBLISHED",
          authorId: "user-id",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-02T00:00:00.000Z",
        },
      });

      expect(loggerMock.info).toHaveBeenCalledWith("content.create.succeeded", {
        contentId: "content-id",
        authorId: "user-id",
      });
    });

    it("ACTIVE 상태가 아니면 CONTENT_FORBIDDEN 실패 Result를 반환한다", async () => {
      const actor = createActor({
        status: "SUSPENDED",
      });

      const result = await createContentService(actor, {
        title: "테스트 제목",
        content: "테스트 본문",
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_FORBIDDEN",
          message: "콘텐츠를 생성할 권한이 없습니다.",
        },
      });

      expect(repositoryMock.createContentRepository).not.toHaveBeenCalled();
    });

    it("repository 에러가 발생하면 실패 Result를 반환하고 로그를 남긴다", async () => {
      const actor = createActor();
      const error = createDatabaseError();

      repositoryMock.createContentRepository.mockRejectedValue(error);

      const result = await createContentService(actor, {
        title: "테스트 제목",
        content: "테스트 본문",
      });

      expect(result).toEqual({
        ok: false,
        error,
      });

      expect(loggerMock.error).toHaveBeenCalledWith("content.create.failed", {
        authorId: "user-id",
        error,
      });
    });
  });

  describe("getContentByIdService", () => {
    it("콘텐츠를 조회하고 ContentDetailResponse를 반환한다", async () => {
      const content = createMockContent();

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);

      const result = await getContentByIdService("content-id");

      expect(repositoryMock.findContentByIdRepository).toHaveBeenCalledWith("content-id");

      expect(result).toEqual({
        ok: true,
        data: {
          id: "content-id",
          title: "테스트 제목",
          content: "테스트 본문",
          status: "PUBLISHED",
          authorId: "user-id",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-02T00:00:00.000Z",
        },
      });
    });

    it("콘텐츠가 없으면 CONTENT_NOT_FOUND 실패 Result를 반환한다", async () => {
      repositoryMock.findContentByIdRepository.mockResolvedValue(null);

      const result = await getContentByIdService("missing-content-id");

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_NOT_FOUND",
          message: "콘텐츠를 찾을 수 없습니다.",
        },
      });
    });

    it("삭제된 콘텐츠를 비로그인 사용자가 조회하면 CONTENT_DELETED 실패 Result를 반환한다", async () => {
      const content = createMockContent({
        status: "DELETED",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);

      const result = await getContentByIdService("content-id");

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_DELETED",
          message: "삭제된 콘텐츠입니다.",
        },
      });
    });

    it("repository 에러가 발생하면 실패 Result를 반환하고 로그를 남긴다", async () => {
      const error = createDatabaseError();

      repositoryMock.findContentByIdRepository.mockRejectedValue(error);

      const result = await getContentByIdService("content-id");

      expect(result).toEqual({
        ok: false,
        error,
      });

      expect(loggerMock.error).toHaveBeenCalledWith("content.get_by_id.failed", {
        contentId: "content-id",
        actorId: undefined,
        actorRole: undefined,
        error,
      });
    });

    it("HIDDEN 콘텐츠를 비로그인 사용자가 조회하면 CONTENT_FORBIDDEN 실패 Result를 반환한다", async () => {
      const content = createMockContent({
        status: "HIDDEN",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);

      const result = await getContentByIdService("content-id");

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_FORBIDDEN",
          message: "콘텐츠를 조회할 권한이 없습니다.",
        },
      });
    });

    it("작성자는 본인의 HIDDEN 콘텐츠를 조회할 수 있다", async () => {
      const actor = createActor({
        id: "user-id",
      });

      const content = createMockContent({
        authorId: "user-id",
        status: "HIDDEN",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);

      const result = await getContentByIdService("content-id", actor);

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.data.status).toBe("HIDDEN");
      }
    });
  });

  describe("getContentsService", () => {
    it("콘텐츠 목록과 pagination meta를 반환한다", async () => {
      const contents = [
        createMockContent({
          id: "content-id-1",
          title: "첫 번째 콘텐츠",
        }),
        createMockContent({
          id: "content-id-2",
          title: "두 번째 콘텐츠",
        }),
      ];

      repositoryMock.findContentsRepository.mockResolvedValue(contents);
      repositoryMock.countContentsRepository.mockResolvedValue(3);

      const result = await getContentsService({
        page: 2,
        limit: 2,
        status: "PUBLISHED",
        authorId: "user-id",
      });

      expect(repositoryMock.findContentsRepository).toHaveBeenCalledWith({
        status: "PUBLISHED",
        authorId: "user-id",
        skip: 2,
        take: 2,
      });

      expect(repositoryMock.countContentsRepository).toHaveBeenCalledWith({
        status: "PUBLISHED",
        authorId: "user-id",
      });

      expect(result).toEqual({
        ok: true,
        data: {
          items: [
            {
              id: "content-id-1",
              title: "첫 번째 콘텐츠",
              status: "PUBLISHED",
              authorId: "user-id",
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-02T00:00:00.000Z",
            },
            {
              id: "content-id-2",
              title: "두 번째 콘텐츠",
              status: "PUBLISHED",
              authorId: "user-id",
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-02T00:00:00.000Z",
            },
          ],
          meta: {
            page: 2,
            limit: 2,
            totalCount: 3,
            totalPages: 2,
            hasNextPage: false,
            hasPreviousPage: true,
          },
        },
      });
    });

    it("query가 없으면 기본 pagination으로 콘텐츠 목록을 조회한다", async () => {
      repositoryMock.findContentsRepository.mockResolvedValue([]);
      repositoryMock.countContentsRepository.mockResolvedValue(0);

      const result = await getContentsService();

      expect(repositoryMock.findContentsRepository).toHaveBeenCalledWith({
        status: undefined,
        authorId: undefined,
        skip: 0,
        take: 20,
      });

      expect(repositoryMock.countContentsRepository).toHaveBeenCalledWith({
        status: undefined,
        authorId: undefined,
      });

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.data.items).toEqual([]);
        expect(result.data.meta).toEqual({
          page: 1,
          limit: 20,
          totalCount: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      }
    });

    it("repository 에러가 발생하면 실패 Result를 반환하고 로그를 남긴다", async () => {
      const error = createDatabaseError();
      const query = {
        page: 1,
        limit: 10,
        status: "PUBLISHED" as const,
      };

      repositoryMock.findContentsRepository.mockRejectedValue(error);
      repositoryMock.countContentsRepository.mockResolvedValue(0);

      const result = await getContentsService(query);

      expect(result).toEqual({
        ok: false,
        error,
      });

      expect(loggerMock.error).toHaveBeenCalledWith("content.get_list.failed", {
        query,
        error,
      });
    });
  });

  describe("updateContentService", () => {
    it("콘텐츠가 없으면 CONTENT_NOT_FOUND 실패 Result를 반환한다", async () => {
      const actor = createActor();

      repositoryMock.findContentByIdRepository.mockResolvedValue(null);

      const result = await updateContentService("missing-content-id", actor, {
        title: "수정된 제목",
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_NOT_FOUND",
          message: "콘텐츠를 찾을 수 없습니다.",
        },
      });

      expect(repositoryMock.updateContentRepository).not.toHaveBeenCalled();
    });

    it("삭제된 콘텐츠면 CONTENT_DELETED 실패 Result를 반환한다", async () => {
      const actor = createActor();
      const content = createMockContent({
        status: "DELETED",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);

      const result = await updateContentService("content-id", actor, {
        title: "수정된 제목",
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_DELETED",
          message: "삭제된 콘텐츠입니다.",
        },
      });

      expect(repositoryMock.updateContentRepository).not.toHaveBeenCalled();
    });

    it("권한이 없으면 CONTENT_FORBIDDEN 실패 Result를 반환한다", async () => {
      const actor = createActor({
        id: "other-user-id",
        role: "USER",
      });

      const content = createMockContent({
        authorId: "author-id",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);

      const result = await updateContentService("content-id", actor, {
        title: "수정된 제목",
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_FORBIDDEN",
          message: "콘텐츠를 수정할 권한이 없습니다.",
        },
      });

      expect(repositoryMock.updateContentRepository).not.toHaveBeenCalled();
    });

    it("콘텐츠를 수정하고 ContentDetailResponse를 반환한다", async () => {
      const actor = createActor({
        id: "user-id",
      });

      const content = createMockContent();

      const updatedContent = createMockContent({
        title: "수정된 제목",
        content: "수정된 본문",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);
      repositoryMock.updateContentRepository.mockResolvedValue(updatedContent);

      const result = await updateContentService("content-id", actor, {
        title: "수정된 제목",
        content: "수정된 본문",
      });

      expect(repositoryMock.updateContentRepository).toHaveBeenCalledWith("content-id", {
        title: "수정된 제목",
        content: "수정된 본문",
      });

      expect(result).toEqual({
        ok: true,
        data: {
          id: "content-id",
          title: "수정된 제목",
          content: "수정된 본문",
          status: "PUBLISHED",
          authorId: "user-id",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-02T00:00:00.000Z",
        },
      });

      expect(loggerMock.info).toHaveBeenCalledWith("content.update.succeeded", {
        contentId: "content-id",
        actorId: "user-id",
        actorRole: "USER",
      });
    });

    it("ADMIN은 다른 사람의 콘텐츠를 수정할 수 있다", async () => {
      const actor = createActor({
        id: "admin-id",
        role: "ADMIN",
      });

      const content = createMockContent({
        authorId: "author-id",
      });

      const updatedContent = createMockContent({
        authorId: "author-id",
        title: "관리자가 수정한 제목",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);
      repositoryMock.updateContentRepository.mockResolvedValue(updatedContent);

      const result = await updateContentService("content-id", actor, {
        title: "관리자가 수정한 제목",
      });

      expect(result.ok).toBe(true);

      expect(repositoryMock.updateContentRepository).toHaveBeenCalledWith("content-id", {
        title: "관리자가 수정한 제목",
        content: undefined,
      });
    });

    it("repository 에러가 발생하면 실패 Result를 반환하고 로그를 남긴다", async () => {
      const actor = createActor();
      const error = createDatabaseError();
      const content = createMockContent();

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);
      repositoryMock.updateContentRepository.mockRejectedValue(error);

      const result = await updateContentService("content-id", actor, {
        title: "수정된 제목",
      });

      expect(result).toEqual({
        ok: false,
        error,
      });

      expect(loggerMock.error).toHaveBeenCalledWith("content.update.failed", {
        contentId: "content-id",
        actorId: "user-id",
        actorRole: "USER",
        error,
      });
    });
  });

  describe("updateContentStatusService", () => {
    it("콘텐츠가 없으면 CONTENT_NOT_FOUND 실패 Result를 반환한다", async () => {
      const actor = createActor({
        role: "ADMIN",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(null);

      const result = await updateContentStatusService("missing-content-id", actor, {
        status: "HIDDEN",
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_NOT_FOUND",
          message: "콘텐츠를 찾을 수 없습니다.",
        },
      });

      expect(repositoryMock.updateContentRepository).not.toHaveBeenCalled();
    });

    it("삭제된 콘텐츠면 CONTENT_DELETED 실패 Result를 반환한다", async () => {
      const actor = createActor({
        role: "ADMIN",
      });

      const content = createMockContent({
        status: "DELETED",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);

      const result = await updateContentStatusService("content-id", actor, {
        status: "HIDDEN",
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_DELETED",
          message: "삭제된 콘텐츠입니다.",
        },
      });

      expect(repositoryMock.updateContentRepository).not.toHaveBeenCalled();
    });

    it("ADMIN이 아니면 CONTENT_FORBIDDEN 실패 Result를 반환한다", async () => {
      const actor = createActor({
        role: "USER",
      });

      const content = createMockContent();

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);

      const result = await updateContentStatusService("content-id", actor, {
        status: "HIDDEN",
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_FORBIDDEN",
          message: "콘텐츠 상태를 변경할 권한이 없습니다.",
        },
      });

      expect(repositoryMock.updateContentRepository).not.toHaveBeenCalled();
    });

    it("ADMIN이 콘텐츠 상태를 변경하고 ContentDetailResponse를 반환한다", async () => {
      const actor = createActor({
        id: "admin-id",
        role: "ADMIN",
      });

      const content = createMockContent();

      const updatedContent = createMockContent({
        status: "HIDDEN",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);
      repositoryMock.updateContentRepository.mockResolvedValue(updatedContent);

      const result = await updateContentStatusService("content-id", actor, {
        status: "HIDDEN",
      });

      expect(repositoryMock.updateContentRepository).toHaveBeenCalledWith("content-id", {
        status: "HIDDEN",
      });

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.data.status).toBe("HIDDEN");
      }

      expect(loggerMock.info).toHaveBeenCalledWith("content.update_status.succeeded", {
        contentId: "content-id",
        status: "HIDDEN",
        actorId: "admin-id",
        actorRole: "ADMIN",
      });
    });

    it("repository 에러가 발생하면 실패 Result를 반환하고 로그를 남긴다", async () => {
      const actor = createActor({
        id: "admin-id",
        role: "ADMIN",
      });

      const error = createDatabaseError();
      const content = createMockContent();

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);
      repositoryMock.updateContentRepository.mockRejectedValue(error);

      const result = await updateContentStatusService("content-id", actor, {
        status: "HIDDEN",
      });

      expect(result).toEqual({
        ok: false,
        error,
      });

      expect(loggerMock.error).toHaveBeenCalledWith("content.update_status.failed", {
        contentId: "content-id",
        actorId: "admin-id",
        actorRole: "ADMIN",
        error,
      });
    });
  });

  describe("softDeleteContentService", () => {
    it("콘텐츠가 없으면 CONTENT_NOT_FOUND 실패 Result를 반환한다", async () => {
      const actor = createActor();

      repositoryMock.findContentByIdRepository.mockResolvedValue(null);

      const result = await softDeleteContentService("missing-content-id", actor);

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_NOT_FOUND",
          message: "콘텐츠를 찾을 수 없습니다.",
        },
      });

      expect(repositoryMock.softDeleteContentRepository).not.toHaveBeenCalled();
    });

    it("이미 삭제된 콘텐츠면 CONTENT_DELETED 실패 Result를 반환한다", async () => {
      const actor = createActor();

      const content = createMockContent({
        status: "DELETED",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);

      const result = await softDeleteContentService("content-id", actor);

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_DELETED",
          message: "이미 삭제된 콘텐츠입니다.",
        },
      });

      expect(repositoryMock.softDeleteContentRepository).not.toHaveBeenCalled();
    });

    it("권한이 없으면 CONTENT_FORBIDDEN 실패 Result를 반환한다", async () => {
      const actor = createActor({
        id: "other-user-id",
        role: "USER",
      });

      const content = createMockContent({
        authorId: "author-id",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);

      const result = await softDeleteContentService("content-id", actor);

      expect(result).toEqual({
        ok: false,
        error: {
          code: "CONTENT_FORBIDDEN",
          message: "콘텐츠를 삭제할 권한이 없습니다.",
        },
      });

      expect(repositoryMock.softDeleteContentRepository).not.toHaveBeenCalled();
    });

    it("콘텐츠를 soft delete 처리하고 ContentDetailResponse를 반환한다", async () => {
      const actor = createActor();

      const content = createMockContent();

      const deletedContent = createMockContent({
        status: "DELETED",
      });

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);
      repositoryMock.softDeleteContentRepository.mockResolvedValue(deletedContent);

      const result = await softDeleteContentService("content-id", actor);

      expect(repositoryMock.softDeleteContentRepository).toHaveBeenCalledWith("content-id");

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.data.status).toBe("DELETED");
      }

      expect(loggerMock.info).toHaveBeenCalledWith("content.soft_delete.succeeded", {
        contentId: "content-id",
        actorId: "user-id",
        actorRole: "USER",
      });
    });

    it("repository 에러가 발생하면 실패 Result를 반환하고 로그를 남긴다", async () => {
      const actor = createActor();
      const error = createDatabaseError();
      const content = createMockContent();

      repositoryMock.findContentByIdRepository.mockResolvedValue(content);
      repositoryMock.softDeleteContentRepository.mockRejectedValue(error);

      const result = await softDeleteContentService("content-id", actor);

      expect(result).toEqual({
        ok: false,
        error,
      });

      expect(loggerMock.error).toHaveBeenCalledWith("content.soft_delete.failed", {
        contentId: "content-id",
        actorId: "user-id",
        actorRole: "USER",
        error,
      });
    });
  });
});
