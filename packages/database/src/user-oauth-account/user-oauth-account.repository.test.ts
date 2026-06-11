import type { AuthProvider, User, UserOAuthAccount } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createUserOAuthAccountRepository,
  findUserOAuthAccountRepository,
  findUserOAuthAccountsByUserIdRepository,
  findUserOAuthAccountWithUserRepository,
} from "./user-oauth-account.repository";

const prismaMock = vi.hoisted(() => ({
  userOAuthAccount: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
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

function createMockUserOAuthAccount(
  overrides: Partial<UserOAuthAccount> = {},
): UserOAuthAccount {
  return {
    id: "oauth-account-id",
    userId: "user-id",
    provider: "GOOGLE",
    providerUserId: "google-user-id",
    email: "user@example.com",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("user-oauth-account.repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUserOAuthAccountRepository", () => {
    it("OAuth 계정을 생성한다", async () => {
      const data = {
        provider: "GOOGLE" as AuthProvider,
        providerUserId: "google-user-id",
        email: "user@example.com",
        user: {
          connect: {
            id: "user-id",
          },
        },
      };

      const oauthAccount = createMockUserOAuthAccount();

      prismaMock.userOAuthAccount.create.mockResolvedValue(oauthAccount);

      const result = await createUserOAuthAccountRepository(data);

      expect(prismaMock.userOAuthAccount.create).toHaveBeenCalledWith({
        data,
      });

      expect(result).toBe(oauthAccount);
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.userOAuthAccount.create.mockRejectedValue(error);

      await expect(
        createUserOAuthAccountRepository({
          provider: "GOOGLE",
          providerUserId: "google-user-id",
          email: "user@example.com",
          user: {
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

  describe("findUserOAuthAccountRepository", () => {
    it("provider와 providerUserId로 OAuth 계정을 조회한다", async () => {
      const oauthAccount = createMockUserOAuthAccount();

      prismaMock.userOAuthAccount.findUnique.mockResolvedValue(oauthAccount);

      const result = await findUserOAuthAccountRepository({
        provider: "GOOGLE",
        providerUserId: "google-user-id",
      });

      expect(prismaMock.userOAuthAccount.findUnique).toHaveBeenCalledWith({
        where: {
          provider_providerUserId: {
            provider: "GOOGLE",
            providerUserId: "google-user-id",
          },
        },
      });

      expect(result).toBe(oauthAccount);
    });

    it("OAuth 계정이 없으면 null을 반환한다", async () => {
      prismaMock.userOAuthAccount.findUnique.mockResolvedValue(null);

      const result = await findUserOAuthAccountRepository({
        provider: "GOOGLE",
        providerUserId: "missing-provider-user-id",
      });

      expect(result).toBeNull();
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.userOAuthAccount.findUnique.mockRejectedValue(error);

      await expect(
        findUserOAuthAccountRepository({
          provider: "GOOGLE",
          providerUserId: "google-user-id",
        }),
      ).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });

  describe("findUserOAuthAccountWithUserRepository", () => {
    it("provider와 providerUserId로 OAuth 계정과 사용자를 함께 조회한다", async () => {
      const user = createMockUser();
      const oauthAccount = {
        ...createMockUserOAuthAccount(),
        user,
      };

      prismaMock.userOAuthAccount.findUnique.mockResolvedValue(oauthAccount);

      const result = await findUserOAuthAccountWithUserRepository({
        provider: "GOOGLE",
        providerUserId: "google-user-id",
      });

      expect(prismaMock.userOAuthAccount.findUnique).toHaveBeenCalledWith({
        where: {
          provider_providerUserId: {
            provider: "GOOGLE",
            providerUserId: "google-user-id",
          },
        },
        include: {
          user: true,
        },
      });

      expect(result).toBe(oauthAccount);
    });

    it("OAuth 계정이 없으면 null을 반환한다", async () => {
      prismaMock.userOAuthAccount.findUnique.mockResolvedValue(null);

      const result = await findUserOAuthAccountWithUserRepository({
        provider: "GOOGLE",
        providerUserId: "missing-provider-user-id",
      });

      expect(result).toBeNull();
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.userOAuthAccount.findUnique.mockRejectedValue(error);

      await expect(
        findUserOAuthAccountWithUserRepository({
          provider: "GOOGLE",
          providerUserId: "google-user-id",
        }),
      ).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });

  describe("findUserOAuthAccountsByUserIdRepository", () => {
    it("userId로 OAuth 계정 목록을 최신순으로 조회한다", async () => {
      const oauthAccounts = [
        createMockUserOAuthAccount({
          id: "oauth-account-id-1",
          provider: "GOOGLE",
        }),
        createMockUserOAuthAccount({
          id: "oauth-account-id-2",
          provider: "NAVER",
          providerUserId: "naver-user-id",
        }),
      ];

      prismaMock.userOAuthAccount.findMany.mockResolvedValue(oauthAccounts);

      const result = await findUserOAuthAccountsByUserIdRepository("user-id");

      expect(prismaMock.userOAuthAccount.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-id",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      expect(result).toBe(oauthAccounts);
    });

    it("OAuth 계정이 없으면 빈 배열을 반환한다", async () => {
      prismaMock.userOAuthAccount.findMany.mockResolvedValue([]);

      const result = await findUserOAuthAccountsByUserIdRepository("user-id");

      expect(result).toEqual([]);
    });

    it("Prisma 에러가 발생하면 AppError를 throw한다", async () => {
      const error = new Error("database error");

      prismaMock.userOAuthAccount.findMany.mockRejectedValue(error);

      await expect(
        findUserOAuthAccountsByUserIdRepository("user-id"),
      ).rejects.toMatchObject({
        code: "DATABASE_UNKNOWN_ERROR",
        message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
        cause: error,
      });
    });
  });
});
