import { randomUUID } from "node:crypto";

import type { Prisma } from "@prisma/client";
import { afterAll, afterEach, describe, expect, it } from "vitest";

import { prisma } from "@repo/database/client";

import { CONTENT_ERROR_CODE } from "../content.error";
import type { ContentPermissionActor } from "../content.permission";
import { createContentService } from "../content.service";

const createdUserIds: string[] = [];

async function createTestUser(overrides: Partial<Prisma.UserCreateInput> = {}) {
  const testId = randomUUID().replaceAll("-", "");

  const user = await prisma.user.create({
    data: {
      email: `content-service-${testId}@example.com`,
      nickname: `content_svc_${testId.slice(0, 24)}`,
      name: "콘텐츠 서비스 테스트 사용자",
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

describe("content.service integration", () => {
  describe("createContentService", () => {
    it("ACTIVE 사용자는 콘텐츠를 생성할 수 있다", async () => {
      const author = await createTestUser();

      const actor = {
        id: author.id,
        role: author.role,
        status: author.status,
      } satisfies ContentPermissionActor;

      const result = await createContentService(actor, {
        title: "서비스 통합 테스트 콘텐츠 제목",
        content: "서비스 통합 테스트 콘텐츠 본문",
      });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      expect(result.data).toMatchObject({
        title: "서비스 통합 테스트 콘텐츠 제목",
        content: "서비스 통합 테스트 콘텐츠 본문",
        status: "PUBLISHED",
        authorId: author.id,
      });

      expect(result.data.id).toEqual(expect.any(String));
      expect(result.data.createdAt).toEqual(expect.any(String));
      expect(result.data.updatedAt).toEqual(expect.any(String));

      const persistedContent = await prisma.content.findUnique({
        where: {
          id: result.data.id,
        },
      });

      expect(persistedContent).not.toBeNull();
      expect(persistedContent).toMatchObject({
        id: result.data.id,
        title: "서비스 통합 테스트 콘텐츠 제목",
        content: "서비스 통합 테스트 콘텐츠 본문",
        status: "PUBLISHED",
        authorId: author.id,
      });
    });

    it("ACTIVE 상태가 아닌 사용자는 콘텐츠를 생성할 수 없다", async () => {
      const author = await createTestUser({
        status: "SUSPENDED",
      });

      const actor = {
        id: author.id,
        role: author.role,
        status: author.status,
      } satisfies ContentPermissionActor;

      const result = await createContentService(actor, {
        title: "생성되면 안 되는 콘텐츠 제목",
        content: "생성되면 안 되는 콘텐츠 본문",
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: CONTENT_ERROR_CODE.FORBIDDEN,
          message: "콘텐츠를 생성할 권한이 없습니다.",
        },
      });

      const contentCount = await prisma.content.count({
        where: {
          authorId: author.id,
        },
      });

      expect(contentCount).toBe(0);
    });
  });
});
