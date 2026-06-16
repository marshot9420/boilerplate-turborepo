import type { Content, ContentStatus, Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  countContentsRepository,
  createContentRepository,
  findContentByIdRepository,
  findContentsRepository,
  softDeleteContentRepository,
  updateContentRepository,
} from "./content.repository";

const prismaMock = vi.hoisted(() => ({
  content: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("../client", () => ({
  prisma: prismaMock,
}));

function createMockContent(overrides: Partial<Content> = {}): Content {
  return {
    id: "content-id",
    title: "테스트 제목",
    content: "테스트 내용",
    status: "PUBLISHED",
    authorId: "user-id",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("content.repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createContentRepository", () => {
    it("콘텐츠를 생성한다", async () => {
      const data: Prisma.ContentCreateInput = {
        title: "테스트 제목",
        content: "테스트 내용",
        author: {
          connect: {
            id: "user-id",
          },
        },
      };

      const content = createMockContent({
        title: "테스트 제목",
        content: "테스트 내용",
        authorId: "user-id",
      });

      prismaMock.content.create.mockResolvedValue(content);

      const result = await createContentRepository(data);

      expect(prismaMock.content.create).toHaveBeenCalledWith({
        data,
      });

      expect(result).toBe(content);
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.content.create.mockRejectedValue(error);

      await expect(
        createContentRepository({
          title: "테스트 제목",
          content: "테스트 내용",
          author: {
            connect: {
              id: "user-id",
            },
          },
        }),
      ).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });

  describe("findContentByIdRepository", () => {
    it("id로 콘텐츠를 조회한다", async () => {
      const content = createMockContent();

      prismaMock.content.findUnique.mockResolvedValue(content);

      const result = await findContentByIdRepository("content-id");

      expect(prismaMock.content.findUnique).toHaveBeenCalledWith({
        where: {
          id: "content-id",
        },
      });

      expect(result).toBe(content);
    });

    it("콘텐츠가 없으면 null을 반환한다", async () => {
      prismaMock.content.findUnique.mockResolvedValue(null);

      const result = await findContentByIdRepository("missing-content-id");

      expect(result).toBeNull();
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.content.findUnique.mockRejectedValue(error);

      await expect(findContentByIdRepository("content-id")).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });

  describe("findContentsRepository", () => {
    it("콘텐츠 목록을 최신순으로 조회한다", async () => {
      const contents = [
        createMockContent({
          id: "content-id-1",
        }),
        createMockContent({
          id: "content-id-2",
        }),
      ];

      prismaMock.content.findMany.mockResolvedValue(contents);

      const result = await findContentsRepository();

      expect(prismaMock.content.findMany).toHaveBeenCalledWith({
        where: {
          status: undefined,
          authorId: undefined,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: undefined,
        take: undefined,
      });

      expect(result).toBe(contents);
    });

    it("status, authorId, skip, take 조건으로 콘텐츠 목록을 조회한다", async () => {
      const contents = [
        createMockContent({
          id: "content-id-1",
          status: "PUBLISHED",
          authorId: "user-id",
        }),
      ];

      const status: ContentStatus = "PUBLISHED";

      prismaMock.content.findMany.mockResolvedValue(contents);

      const result = await findContentsRepository({
        status,
        authorId: "user-id",
        skip: 10,
        take: 20,
      });

      expect(prismaMock.content.findMany).toHaveBeenCalledWith({
        where: {
          status,
          authorId: "user-id",
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: 10,
        take: 20,
      });

      expect(result).toBe(contents);
    });

    it("콘텐츠가 없으면 빈 배열을 반환한다", async () => {
      prismaMock.content.findMany.mockResolvedValue([]);

      const result = await findContentsRepository();

      expect(result).toEqual([]);
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.content.findMany.mockRejectedValue(error);

      await expect(findContentsRepository()).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });

  describe("countContentsRepository", () => {
    it("콘텐츠 개수를 조회한다", async () => {
      prismaMock.content.count.mockResolvedValue(3);

      const result = await countContentsRepository();

      expect(prismaMock.content.count).toHaveBeenCalledWith({
        where: {
          status: undefined,
          authorId: undefined,
        },
      });

      expect(result).toBe(3);
    });

    it("status와 authorId 조건으로 콘텐츠 개수를 조회한다", async () => {
      const status: ContentStatus = "PUBLISHED";

      prismaMock.content.count.mockResolvedValue(1);

      const result = await countContentsRepository({
        status,
        authorId: "user-id",
      });

      expect(prismaMock.content.count).toHaveBeenCalledWith({
        where: {
          status,
          authorId: "user-id",
        },
      });

      expect(result).toBe(1);
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.content.count.mockRejectedValue(error);

      await expect(countContentsRepository()).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });

  describe("updateContentRepository", () => {
    it("콘텐츠를 수정한다", async () => {
      const data: Prisma.ContentUpdateInput = {
        title: "수정된 제목",
        content: "수정된 내용",
      };

      const content = createMockContent({
        title: "수정된 제목",
        content: "수정된 내용",
      });

      prismaMock.content.update.mockResolvedValue(content);

      const result = await updateContentRepository("content-id", data);

      expect(prismaMock.content.update).toHaveBeenCalledWith({
        where: {
          id: "content-id",
        },
        data,
      });

      expect(result).toBe(content);
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.content.update.mockRejectedValue(error);

      await expect(
        updateContentRepository("content-id", {
          title: "수정된 제목",
        }),
      ).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });

  describe("softDeleteContentRepository", () => {
    it("콘텐츠 상태를 DELETED로 변경한다", async () => {
      const content = createMockContent({
        status: "DELETED",
      });

      prismaMock.content.update.mockResolvedValue(content);

      const result = await softDeleteContentRepository("content-id");

      expect(prismaMock.content.update).toHaveBeenCalledWith({
        where: {
          id: "content-id",
        },
        data: {
          status: "DELETED",
        },
      });

      expect(result).toBe(content);
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.content.update.mockRejectedValue(error);

      await expect(softDeleteContentRepository("content-id")).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });
});
