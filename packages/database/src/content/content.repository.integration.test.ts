import { randomUUID } from "node:crypto";

import type { ContentStatus, Prisma } from "@prisma/client";
import { afterAll, afterEach, describe, expect, it } from "vitest";

import { prisma } from "../client";
import {
  createContentRepository,
  softDeleteContentRepository,
  updateContentRepository,
} from "./content.repository";

const createdUserIds: string[] = [];

async function createTestUser(overrides: Partial<Prisma.UserCreateInput> = {}) {
  const testId = randomUUID().replaceAll("-", "");

  const user = await prisma.user.create({
    data: {
      email: `content-repository-${testId}@example.com`,
      nickname: `content_repo_${testId.slice(0, 24)}`,
      name: "콘텐츠 레포지토리 테스트 사용자",
      ...overrides,
    },
  });

  createdUserIds.push(user.id);

  return user;
}

async function createTestContent(status: ContentStatus = "PUBLISHED") {
  const author = await createTestUser();

  return createContentRepository({
    title: "상태 변경 테스트 제목",
    content: "상태 변경 테스트 본문",
    status,
    author: {
      connect: {
        id: author.id,
      },
    },
  });
}

afterEach(async () => {
  if (createdUserIds.length === 0) {
    return;
  }

  await prisma.content.deleteMany({
    where: {
      authorId: {
        in: createdUserIds,
      },
    },
  });

  await prisma.user.deleteMany({
    where: {
      id: {
        in: createdUserIds,
      },
    },
  });

  createdUserIds.length = 0;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("content.repository integration", () => {
  describe("createContentRepository", () => {
    it("콘텐츠를 생성하고 기본 상태를 PUBLISHED로 저장한다", async () => {
      const author = await createTestUser();

      const content = await createContentRepository({
        title: "통합 테스트 콘텐츠 제목",
        content: "통합 테스트 콘텐츠 본문",
        author: {
          connect: {
            id: author.id,
          },
        },
      });

      expect(content.id).toEqual(expect.any(String));
      expect(content.title).toBe("통합 테스트 콘텐츠 제목");
      expect(content.content).toBe("통합 테스트 콘텐츠 본문");
      expect(content.status).toBe("PUBLISHED");
      expect(content.authorId).toBe(author.id);
      expect(content.createdAt).toBeInstanceOf(Date);
      expect(content.updatedAt).toBeInstanceOf(Date);

      const persistedContent = await prisma.content.findUnique({
        where: {
          id: content.id,
        },
      });

      expect(persistedContent).not.toBeNull();
      expect(persistedContent).toMatchObject({
        id: content.id,
        title: "통합 테스트 콘텐츠 제목",
        content: "통합 테스트 콘텐츠 본문",
        status: "PUBLISHED",
        authorId: author.id,
      });
    });
  });

  describe("updateContentRepository", () => {
    it("기대 상태가 현재 상태와 같으면 상태 변경을 저장한다", async () => {
      const content = await createTestContent("PUBLISHED");

      const updatedContent = await updateContentRepository(
        content.id,
        { status: "HIDDEN" },
        "PUBLISHED",
      );

      expect(updatedContent).toMatchObject({ id: content.id, status: "HIDDEN" });
      await expect(
        prisma.content.findUniqueOrThrow({ where: { id: content.id } }),
      ).resolves.toMatchObject({ id: content.id, status: "HIDDEN" });
    });

    it("공개 상태 조회 후 삭제된 콘텐츠는 오래된 상태 변경으로 복구하지 않는다", async () => {
      const content = await createTestContent("PUBLISHED");
      const snapshot = await prisma.content.findUniqueOrThrow({ where: { id: content.id } });

      await softDeleteContentRepository(content.id);

      await expect(
        updateContentRepository(
          content.id,
          { status: "HIDDEN", title: "오래된 상태 변경 제목" },
          snapshot.status,
        ),
      ).rejects.toMatchObject({ code: "DATABASE_RECORD_NOT_FOUND" });
      await expect(
        prisma.content.findUniqueOrThrow({ where: { id: content.id } }),
      ).resolves.toMatchObject({ status: "DELETED", title: content.title });
    });

    it.each([
      ["PUBLISHED", "HIDDEN"],
      ["HIDDEN", "PUBLISHED"],
    ] as const)(
      "조회한 %s 상태가 %s로 바뀌면 오래된 변경을 거부한다",
      async (initialStatus, nextStatus) => {
        const content = await createTestContent(initialStatus);
        const snapshot = await prisma.content.findUniqueOrThrow({ where: { id: content.id } });

        await updateContentRepository(content.id, { status: nextStatus }, initialStatus);

        await expect(
          updateContentRepository(
            content.id,
            { status: nextStatus, title: "오래된 상태 변경 제목" },
            snapshot.status,
          ),
        ).rejects.toMatchObject({ code: "DATABASE_RECORD_NOT_FOUND" });
        await expect(
          prisma.content.findUniqueOrThrow({ where: { id: content.id } }),
        ).resolves.toMatchObject({ status: nextStatus, title: content.title });
      },
    );
  });

  describe("softDeleteContentRepository", () => {
    it.each([
      ["PUBLISHED", "HIDDEN"],
      ["HIDDEN", "PUBLISHED"],
    ] as const)(
      "%s에서 %s로 변경과 삭제가 동시에 실행되어도 삭제 상태를 유지한다",
      async (initialStatus, nextStatus) => {
        const content = await createTestContent(initialStatus);
        const snapshot = await prisma.content.findUniqueOrThrow({ where: { id: content.id } });

        const [deleteResult, statusChangeResult] = await Promise.allSettled([
          softDeleteContentRepository(content.id),
          updateContentRepository(content.id, { status: nextStatus }, snapshot.status),
        ]);

        expect(deleteResult.status).toBe("fulfilled");

        if (statusChangeResult.status === "fulfilled") {
          expect(statusChangeResult.value).toMatchObject({ id: content.id, status: nextStatus });
        } else {
          expect(statusChangeResult.reason).toMatchObject({ code: "DATABASE_RECORD_NOT_FOUND" });
        }

        await expect(
          prisma.content.findUniqueOrThrow({ where: { id: content.id } }),
        ).resolves.toMatchObject({ status: "DELETED" });
      },
    );
  });
});
