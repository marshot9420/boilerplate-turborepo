import type { Prisma, User } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createUserRepository,
  findUserByEmailRepository,
  findUserByIdRepository,
  findUserByNicknameRepository,
  softDeleteUserRepository,
  updateUserRepository,
} from "./user.repository";

const prismaMock = vi.hoisted(() => ({
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("../client", () => ({
  prisma: prismaMock,
}));

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-id",
    email: "user@example.com",
    name: "홍길동",
    nickname: "gildong",
    image: null,
    role: "USER",
    status: "ACTIVE",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    deletedAt: null,
    ...overrides,
  } as User;
}

describe("user.repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUserRepository", () => {
    it("사용자를 생성한다", async () => {
      const data: Prisma.UserCreateInput = {
        email: "user@example.com",
        name: "홍길동",
        nickname: "gildong",
      };

      function createMockUser(overrides: Partial<User> = {}): User {
        return {
          id: "user-id",
          email: "user@example.com",
          name: "홍길동",
          avatarUrl: null,
          nickname: "gildong",
          role: "USER",
          status: "ACTIVE",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
          lastLoginAt: null,
          deletedAt: null,
          ...overrides,
        };
      }

      const user = createMockUser();

      prismaMock.user.findUnique.mockResolvedValue(user);

      prismaMock.user.create.mockResolvedValue(user);

      const result = await createUserRepository(data);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data,
      });

      expect(result).toBe(user);
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.user.create.mockRejectedValue(error);

      await expect(
        createUserRepository({
          email: "user@example.com",
          name: "홍길동",
          nickname: "gildong",
        }),
      ).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });

  describe("findUserByIdRepository", () => {
    it("id로 사용자를 조회한다", async () => {
      const user = createMockUser();

      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await findUserByIdRepository("user-id");

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: "user-id",
        },
      });

      expect(result).toBe(user);
    });

    it("사용자가 없으면 null을 반환한다", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await findUserByIdRepository("missing-user-id");

      expect(result).toBeNull();
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.user.findUnique.mockRejectedValue(error);

      await expect(findUserByIdRepository("user-id")).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });

  describe("findUserByEmailRepository", () => {
    it("email로 사용자를 조회한다", async () => {
      const user = createMockUser();

      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await findUserByEmailRepository("user@example.com");

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: "user@example.com",
        },
      });

      expect(result).toBe(user);
    });

    it("사용자가 없으면 null을 반환한다", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await findUserByEmailRepository("missing@example.com");

      expect(result).toBeNull();
    });
  });

  describe("findUserByNicknameRepository", () => {
    it("nickname으로 사용자를 조회한다", async () => {
      const user = createMockUser();

      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await findUserByNicknameRepository("gildong");

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: {
          nickname: "gildong",
        },
      });

      expect(result).toBe(user);
    });

    it("사용자가 없으면 null을 반환한다", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await findUserByNicknameRepository("missing-nickname");

      expect(result).toBeNull();
    });
  });

  describe("updateUserRepository", () => {
    it("사용자를 수정한다", async () => {
      const data: Prisma.UserUpdateInput = {
        nickname: "updated",
      };

      const user = createMockUser({
        nickname: "updated",
      });

      prismaMock.user.update.mockResolvedValue(user);

      const result = await updateUserRepository("user-id", data);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: {
          id: "user-id",
        },
        data,
      });

      expect(result).toBe(user);
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.user.update.mockRejectedValue(error);

      await expect(
        updateUserRepository("user-id", {
          nickname: "updated",
        }),
      ).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });

  describe("softDeleteUserRepository", () => {
    it("사용자 상태를 DELETED로 변경하고 deletedAt을 기록한다", async () => {
      vi.useFakeTimers();

      const now = new Date("2026-01-01T00:00:00.000Z");
      vi.setSystemTime(now);

      const user = createMockUser({
        status: "DELETED",
        deletedAt: now,
      });

      prismaMock.user.update.mockResolvedValue(user);

      const result = await softDeleteUserRepository("user-id");

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: {
          id: "user-id",
        },
        data: {
          status: "DELETED",
          deletedAt: now,
        },
      });

      expect(result).toBe(user);

      vi.useRealTimers();
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.user.update.mockRejectedValue(error);

      await expect(softDeleteUserRepository("user-id")).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });
});
