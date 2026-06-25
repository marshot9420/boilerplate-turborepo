import { randomUUID } from "node:crypto";

import type { Prisma } from "@prisma/client";
import { afterAll, afterEach, describe, expect, it } from "vitest";

import { prisma } from "../client";
import { createContentRepository } from "./content.repository";

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
});
