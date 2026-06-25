import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

import type { Prisma } from "@prisma/client";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { requireUser } from "@repo/auth/server";
import { prisma } from "@repo/database/client";
import { CONTENT_ERROR_CODE } from "@repo/domain/content/server";

import { URLS } from "@/constants";

import { createContentAction } from "../create-content.action";

vi.mock("@repo/auth/server", () => ({
  requireUser: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const createdUserIds: string[] = [];

async function createTestUser(overrides: Partial<Prisma.UserCreateInput> = {}) {
  const testId = randomUUID().replaceAll("-", "");

  const user = await prisma.user.create({
    data: {
      email: `create-content-action-${testId}@example.com`,
      nickname: `create_action_${testId.slice(0, 22)}`,
      name: "콘텐츠 액션 테스트 사용자",
      ...overrides,
    },
  });

  createdUserIds.push(user.id);

  return user;
}

function createFormData(input: { title?: string; content?: string }) {
  const formData = new FormData();

  if (input.title !== undefined) {
    formData.set("title", input.title);
  }

  if (input.content !== undefined) {
    formData.set("content", input.content);
  }

  return formData;
}

beforeEach(() => {
  vi.clearAllMocks();
});

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

describe("createContentAction integration", () => {
  it("인증된 ACTIVE 사용자가 유효한 FormData를 제출하면 콘텐츠를 생성하고 관련 경로를 revalidate한다", async () => {
    const author = await createTestUser();

    vi.mocked(requireUser).mockResolvedValue({
      user: {
        id: author.id,
        role: author.role,
        status: author.status,
      },
    } as Awaited<ReturnType<typeof requireUser>>);

    const result = await createContentAction(
      null,
      createFormData({
        title: "액션 통합 테스트 콘텐츠 제목",
        content: "액션 통합 테스트 콘텐츠 본문",
      }),
    );

    if (!result.ok) {
      throw new Error(result.message);
    }

    expect(result.message).toBe("콘텐츠가 생성되었습니다.");
    expect(result.data).toMatchObject({
      title: "액션 통합 테스트 콘텐츠 제목",
      content: "액션 통합 테스트 콘텐츠 본문",
      status: "PUBLISHED",
      authorId: author.id,
    });

    const persistedContent = await prisma.content.findUnique({
      where: {
        id: result.data.id,
      },
    });

    expect(persistedContent).not.toBeNull();
    expect(persistedContent).toMatchObject({
      id: result.data.id,
      title: "액션 통합 테스트 콘텐츠 제목",
      content: "액션 통합 테스트 콘텐츠 본문",
      status: "PUBLISHED",
      authorId: author.id,
    });

    expect(revalidatePath).toHaveBeenCalledTimes(2);
    expect(revalidatePath).toHaveBeenCalledWith(URLS.CLIENT.HOME);
    expect(revalidatePath).toHaveBeenCalledWith(URLS.CLIENT.MY_PAGE);
  });

  it("FormData 검증에 실패하면 콘텐츠를 생성하지 않고 revalidate하지 않는다", async () => {
    const author = await createTestUser();

    vi.mocked(requireUser).mockResolvedValue({
      user: {
        id: author.id,
        role: author.role,
        status: author.status,
      },
    } as Awaited<ReturnType<typeof requireUser>>);

    const result = await createContentAction(
      null,
      createFormData({
        title: "",
        content: "",
      }),
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("검증 실패 케이스에서 성공 결과가 반환되었습니다.");
    }

    expect(result.code).toBe("VALIDATION_ERROR");
    expect(result.fieldErrors?.title).toEqual(["제목을 입력해 주세요."]);
    expect(result.fieldErrors?.content).toEqual(["본문을 입력해 주세요."]);

    const contentCount = await prisma.content.count({
      where: {
        authorId: author.id,
      },
    });

    expect(contentCount).toBe(0);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("ACTIVE 상태가 아닌 사용자는 콘텐츠를 생성하지 못하고 revalidate하지 않는다", async () => {
    const author = await createTestUser({
      status: "SUSPENDED",
    });

    vi.mocked(requireUser).mockResolvedValue({
      user: {
        id: author.id,
        role: author.role,
        status: author.status,
      },
    } as Awaited<ReturnType<typeof requireUser>>);

    const result = await createContentAction(
      null,
      createFormData({
        title: "생성되면 안 되는 콘텐츠 제목",
        content: "생성되면 안 되는 콘텐츠 본문",
      }),
    );

    expect(result).toEqual({
      ok: false,
      code: CONTENT_ERROR_CODE.FORBIDDEN,
      message: "콘텐츠를 생성할 권한이 없습니다.",
      fieldErrors: undefined,
    });

    const contentCount = await prisma.content.count({
      where: {
        authorId: author.id,
      },
    });

    expect(contentCount).toBe(0);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("인증되지 않은 사용자는 액션 실행 전에 거부된다", async () => {
    vi.mocked(requireUser).mockRejectedValue(new Error("UNAUTHORIZED"));

    await expect(
      createContentAction(
        null,
        createFormData({
          title: "인증 실패 콘텐츠 제목",
          content: "인증 실패 콘텐츠 본문",
        }),
      ),
    ).rejects.toThrow("UNAUTHORIZED");

    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
