import type { User, UserOAuthAccount } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AppError } from "@repo/core/errors";

import {
  findOrCreateOAuthUserService,
  getUserByIdService,
  getUsersService,
  softDeleteUserService,
  updateUserProfileService,
} from "../user.service";

const repositoryMock = vi.hoisted(() => ({
  createUserRepository: vi.fn(),
  findUserByEmailRepository: vi.fn(),
  findUserByIdRepository: vi.fn(),
  findUserByNicknameRepository: vi.fn(),
  findUsersAndCountRepository: vi.fn(),
  softDeleteUserRepository: vi.fn(),
  updateUserRepository: vi.fn(),
}));

const oauthAccountRepositoryMock = vi.hoisted(() => ({
  createUserOAuthAccountRepository: vi.fn(),
  findUserOAuthAccountWithUserRepository: vi.fn(),
}));

const loggerMock = vi.hoisted(() => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

vi.mock("@repo/database/user", () => repositoryMock);
vi.mock("@repo/database/user-oauth-account", () => oauthAccountRepositoryMock);

vi.mock("@repo/core/logger", () => ({
  logger: loggerMock,
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
    updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    lastLoginAt: null,
    deletedAt: null,
    ...overrides,
  };
}

function createMockUserOAuthAccountWithUser(
  overrides: Partial<UserOAuthAccount & { user: User }> = {},
): UserOAuthAccount & { user: User } {
  const user = overrides.user ?? createMockUser();

  return {
    id: "oauth-account-id",
    email: user.email,
    provider: "GOOGLE",
    providerUserId: "google-user-id",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    userId: user.id,
    ...overrides,
    user,
  };
}

function createDatabaseError(): AppError {
  return {
    code: "DATABASE_UNKNOWN_ERROR",
    message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
  };
}

describe("user.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUsersService", () => {
    it("관리자가 사용자 목록을 조회하면 UserListResponse를 반환한다", async () => {
      const users = [
        createMockUser({
          id: "user-1",
          email: "alpha@example.com",
          name: "알파",
          nickname: "alpha",
          role: "USER",
          status: "ACTIVE",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          lastLoginAt: new Date("2026-01-03T00:00:00.000Z"),
        }),
        createMockUser({
          id: "user-2",
          email: "bravo@example.com",
          name: "브라보",
          nickname: "bravo",
          role: "ADMIN",
          status: "ACTIVE",
          createdAt: new Date("2026-01-02T00:00:00.000Z"),
          lastLoginAt: null,
        }),
      ];

      repositoryMock.findUsersAndCountRepository.mockResolvedValue({
        users,
        totalElements: 2,
      });

      const result = await getUsersService(
        {
          id: "admin-id",
          role: "ADMIN",
          status: "ACTIVE",
        },
        {
          page: 1,
          limit: 10,
          keyword: "alpha",
          role: "USER",
          status: "ACTIVE",
          sortKey: "EMAIL",
          sortDirection: "asc",
        },
      );

      expect(repositoryMock.findUsersAndCountRepository).toHaveBeenCalledWith({
        keyword: "alpha",
        role: "USER",
        status: "ACTIVE",
        sortKey: "EMAIL",
        sortDirection: "asc",
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({
        ok: true,
        data: {
          items: [
            {
              id: "user-1",
              email: "alpha@example.com",
              name: "알파",
              avatarUrl: null,
              nickname: "alpha",
              role: "USER",
              status: "ACTIVE",
              createdAt: "2026-01-01T00:00:00.000Z",
              lastLoginAt: "2026-01-03T00:00:00.000Z",
            },
            {
              id: "user-2",
              email: "bravo@example.com",
              name: "브라보",
              avatarUrl: null,
              nickname: "bravo",
              role: "ADMIN",
              status: "ACTIVE",
              createdAt: "2026-01-02T00:00:00.000Z",
              lastLoginAt: null,
            },
          ],
          meta: {
            page: 1,
            limit: 10,
            totalCount: 2,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      });
    });

    it("page와 limit이 없으면 기본 pagination으로 사용자 목록을 조회한다", async () => {
      repositoryMock.findUsersAndCountRepository.mockResolvedValue({
        users: [],
        totalElements: 0,
      });

      const result = await getUsersService(
        {
          id: "admin-id",
          role: "ADMIN",
          status: "ACTIVE",
        },
        {},
      );

      expect(repositoryMock.findUsersAndCountRepository).toHaveBeenCalledWith({
        keyword: undefined,
        role: undefined,
        status: undefined,
        sortKey: undefined,
        sortDirection: undefined,
        skip: 0,
        take: 20,
      });

      expect(result).toEqual({
        ok: true,
        data: {
          items: [],
          meta: {
            page: 1,
            limit: 20,
            totalCount: 0,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      });
    });

    it("관리자가 아니면 USER_FORBIDDEN 실패 Result를 반환한다", async () => {
      const result = await getUsersService(
        {
          id: "user-id",
          role: "USER",
          status: "ACTIVE",
        },
        {
          page: 1,
          limit: 10,
        },
      );

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_FORBIDDEN",
          message: "사용자 목록을 조회할 권한이 없습니다.",
        },
      });

      expect(repositoryMock.findUsersAndCountRepository).not.toHaveBeenCalled();
    });

    it("관리자여도 ACTIVE 상태가 아니면 USER_FORBIDDEN 실패 Result를 반환한다", async () => {
      const result = await getUsersService(
        {
          id: "admin-id",
          role: "ADMIN",
          status: "SUSPENDED",
        },
        {
          page: 1,
          limit: 10,
        },
      );

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_FORBIDDEN",
          message: "사용자 목록을 조회할 권한이 없습니다.",
        },
      });

      expect(repositoryMock.findUsersAndCountRepository).not.toHaveBeenCalled();
    });

    it("repository 에러가 발생하면 실패 Result를 반환하고 로그를 남긴다", async () => {
      const error = createDatabaseError();

      repositoryMock.findUsersAndCountRepository.mockRejectedValue(error);

      const result = await getUsersService(
        {
          id: "admin-id",
          role: "ADMIN",
          status: "ACTIVE",
        },
        {
          page: 1,
          limit: 10,
        },
      );

      expect(result).toEqual({
        ok: false,
        error,
      });

      expect(loggerMock.error).toHaveBeenCalledWith("user.get_list.failed", {
        actorId: "admin-id",
        query: {
          page: 1,
          limit: 10,
        },
        error,
      });
    });
  });

  describe("getUserByIdService", () => {
    it("사용자를 조회하고 UserDetailResponse를 반환한다", async () => {
      const user = createMockUser();

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);

      const result = await getUserByIdService("user-id");

      expect(repositoryMock.findUserByIdRepository).toHaveBeenCalledWith("user-id");

      expect(result).toEqual({
        ok: true,
        data: {
          id: "user-id",
          email: "user@example.com",
          name: "홍길동",
          avatarUrl: null,
          nickname: "gildong",
          role: "USER",
          status: "ACTIVE",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-02T00:00:00.000Z",
          lastLoginAt: null,
          deletedAt: null,
        },
      });
    });

    it("사용자가 없으면 USER_NOT_FOUND 실패 Result를 반환한다", async () => {
      repositoryMock.findUserByIdRepository.mockResolvedValue(null);

      const result = await getUserByIdService("missing-user-id");

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
        },
      });
    });

    it("삭제된 사용자면 USER_NOT_FOUND 실패 Result를 반환한다", async () => {
      const user = createMockUser({
        status: "DELETED",
      });

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);

      const result = await getUserByIdService("user-id");

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
        },
      });
    });

    it("repository 에러가 발생하면 실패 Result를 반환하고 로그를 남긴다", async () => {
      const error = createDatabaseError();

      repositoryMock.findUserByIdRepository.mockRejectedValue(error);

      const result = await getUserByIdService("user-id");

      expect(result).toEqual({
        ok: false,
        error,
      });

      expect(loggerMock.error).toHaveBeenCalledWith("user.get_by_id.failed", {
        userId: "user-id",
        error,
      });
    });
  });

  describe("updateUserProfileService", () => {
    it("사용자가 없으면 USER_NOT_FOUND 실패 Result를 반환한다", async () => {
      repositoryMock.findUserByIdRepository.mockResolvedValue(null);

      const result = await updateUserProfileService("missing-user-id", {
        name: "홍길동",
        avatarUrl: null,
        nickname: "gildong",
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
        },
      });

      expect(repositoryMock.updateUserRepository).not.toHaveBeenCalled();
    });

    it("삭제된 사용자면 USER_NOT_FOUND 실패 Result를 반환한다", async () => {
      const user = createMockUser({
        status: "DELETED",
      });

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);

      const result = await updateUserProfileService("user-id", {
        name: "홍길동",
        avatarUrl: null,
        nickname: "gildong",
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
        },
      });

      expect(repositoryMock.updateUserRepository).not.toHaveBeenCalled();
    });

    it("정지된 사용자면 USER_SUSPENDED 실패 Result를 반환한다", async () => {
      const user = createMockUser({
        status: "SUSPENDED",
      });

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);

      const result = await updateUserProfileService("user-id", {
        name: "홍길동",
        avatarUrl: null,
        nickname: "gildong",
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_SUSPENDED",
          message: "정지된 사용자는 프로필을 수정할 수 없습니다.",
        },
      });

      expect(repositoryMock.updateUserRepository).not.toHaveBeenCalled();
    });

    it("차단된 사용자면 USER_BANNED 실패 Result를 반환한다", async () => {
      const user = createMockUser({
        status: "BANNED",
      });

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);

      const result = await updateUserProfileService("user-id", {
        name: "홍길동",
        avatarUrl: null,
        nickname: "gildong",
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_BANNED",
          message: "차단된 사용자는 프로필을 수정할 수 없습니다.",
        },
      });

      expect(repositoryMock.updateUserRepository).not.toHaveBeenCalled();
    });

    it("닉네임이 기존과 같으면 중복 검사를 하지 않고 프로필을 수정한다", async () => {
      const user = createMockUser({
        nickname: "gildong",
      });

      const updatedUser = createMockUser({
        name: "수정된 이름",
        avatarUrl: "https://example.com/avatar.png",
        nickname: "gildong",
      });

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);
      repositoryMock.updateUserRepository.mockResolvedValue(updatedUser);

      const result = await updateUserProfileService("user-id", {
        name: "수정된 이름",
        avatarUrl: "https://example.com/avatar.png",
        nickname: "gildong",
      });

      expect(repositoryMock.findUserByNicknameRepository).not.toHaveBeenCalled();

      expect(repositoryMock.updateUserRepository).toHaveBeenCalledWith("user-id", {
        name: "수정된 이름",
        avatarUrl: "https://example.com/avatar.png",
        nickname: "gildong",
      });

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.data.name).toBe("수정된 이름");
        expect(result.data.avatarUrl).toBe("https://example.com/avatar.png");
        expect(result.data.nickname).toBe("gildong");
      }

      expect(loggerMock.info).toHaveBeenCalledWith("user.update_profile.succeeded", {
        userId: "user-id",
      });
    });

    it("변경할 닉네임이 이미 사용 중이면 USER_NICKNAME_DUPLICATED 실패 Result를 반환한다", async () => {
      const user = createMockUser({
        nickname: "gildong",
      });

      const duplicatedUser = createMockUser({
        id: "other-user-id",
        nickname: "new_nickname",
      });

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);
      repositoryMock.findUserByNicknameRepository.mockResolvedValue(duplicatedUser);

      const result = await updateUserProfileService("user-id", {
        name: "홍길동",
        avatarUrl: null,
        nickname: "new_nickname",
      });

      expect(repositoryMock.findUserByNicknameRepository).toHaveBeenCalledWith("new_nickname");

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_NICKNAME_DUPLICATED",
          message: "이미 사용 중인 닉네임입니다.",
          fieldErrors: {
            nickname: ["이미 사용 중인 닉네임입니다."],
          },
        },
      });

      expect(repositoryMock.updateUserRepository).not.toHaveBeenCalled();
    });

    it("변경할 닉네임이 중복되지 않으면 프로필을 수정한다", async () => {
      const user = createMockUser({
        nickname: "gildong",
      });

      const updatedUser = createMockUser({
        name: null,
        avatarUrl: null,
        nickname: "new_nickname",
      });

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);
      repositoryMock.findUserByNicknameRepository.mockResolvedValue(null);
      repositoryMock.updateUserRepository.mockResolvedValue(updatedUser);

      const result = await updateUserProfileService("user-id", {
        name: null,
        avatarUrl: null,
        nickname: "new_nickname",
      });

      expect(repositoryMock.findUserByNicknameRepository).toHaveBeenCalledWith("new_nickname");

      expect(repositoryMock.updateUserRepository).toHaveBeenCalledWith("user-id", {
        name: null,
        avatarUrl: null,
        nickname: "new_nickname",
      });

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.data.nickname).toBe("new_nickname");
      }
    });

    it("repository 에러가 발생하면 실패 Result를 반환하고 로그를 남긴다", async () => {
      const error = createDatabaseError();
      const user = createMockUser();

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);
      repositoryMock.updateUserRepository.mockRejectedValue(error);

      const result = await updateUserProfileService("user-id", {
        name: "홍길동",
        avatarUrl: null,
        nickname: "gildong",
      });

      expect(result).toEqual({
        ok: false,
        error,
      });

      expect(loggerMock.error).toHaveBeenCalledWith("user.update_profile.failed", {
        userId: "user-id",
        error,
      });
    });
  });

  describe("softDeleteUserService", () => {
    it("사용자가 없으면 USER_NOT_FOUND 실패 Result를 반환한다", async () => {
      repositoryMock.findUserByIdRepository.mockResolvedValue(null);

      const result = await softDeleteUserService("missing-user-id");

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
        },
      });

      expect(repositoryMock.softDeleteUserRepository).not.toHaveBeenCalled();
    });

    it("이미 삭제된 사용자면 USER_NOT_FOUND 실패 Result를 반환한다", async () => {
      const user = createMockUser({
        status: "DELETED",
      });

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);

      const result = await softDeleteUserService("user-id");

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
        },
      });

      expect(repositoryMock.softDeleteUserRepository).not.toHaveBeenCalled();
    });

    it("사용자를 soft delete 처리하고 UserDetailResponse를 반환한다", async () => {
      const user = createMockUser();

      const deletedUser = createMockUser({
        status: "DELETED",
        deletedAt: new Date("2026-01-03T00:00:00.000Z"),
      });

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);
      repositoryMock.softDeleteUserRepository.mockResolvedValue(deletedUser);

      const result = await softDeleteUserService("user-id");

      expect(repositoryMock.softDeleteUserRepository).toHaveBeenCalledWith("user-id");

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.data.status).toBe("DELETED");
        expect(result.data.deletedAt).toBe("2026-01-03T00:00:00.000Z");
      }

      expect(loggerMock.info).toHaveBeenCalledWith("user.soft_delete.succeeded", {
        userId: "user-id",
      });
    });

    it("repository 에러가 발생하면 실패 Result를 반환하고 로그를 남긴다", async () => {
      const error = createDatabaseError();
      const user = createMockUser();

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);
      repositoryMock.softDeleteUserRepository.mockRejectedValue(error);

      const result = await softDeleteUserService("user-id");

      expect(result).toEqual({
        ok: false,
        error,
      });

      expect(loggerMock.error).toHaveBeenCalledWith("user.soft_delete.failed", {
        userId: "user-id",
        error,
      });
    });
  });

  describe("findOrCreateOAuthUserService", () => {
    it("기존 OAuth 계정이 있으면 사용자 정보를 갱신하고 UserResponse를 반환한다", async () => {
      const oauthUser = createMockUser({
        id: "user-id",
        email: "user@example.com",
        name: "기존 이름",
        avatarUrl: null,
      });

      const updatedUser = createMockUser({
        id: "user-id",
        email: "user@example.com",
        name: "Google User",
        avatarUrl: "https://example.com/avatar.png",
      });

      oauthAccountRepositoryMock.findUserOAuthAccountWithUserRepository.mockResolvedValue(
        createMockUserOAuthAccountWithUser({
          user: oauthUser,
        }),
      );

      repositoryMock.updateUserRepository.mockResolvedValue(updatedUser);

      const result = await findOrCreateOAuthUserService({
        provider: "GOOGLE",
        providerUserId: "google-user-id",
        email: "user@example.com",
        name: "Google User",
        avatarUrl: "https://example.com/avatar.png",
      });

      expect(
        oauthAccountRepositoryMock.findUserOAuthAccountWithUserRepository,
      ).toHaveBeenCalledWith({
        provider: "GOOGLE",
        providerUserId: "google-user-id",
      });

      expect(repositoryMock.updateUserRepository).toHaveBeenCalledWith("user-id", {
        name: "Google User",
        avatarUrl: "https://example.com/avatar.png",
      });

      expect(repositoryMock.findUserByEmailRepository).not.toHaveBeenCalled();
      expect(oauthAccountRepositoryMock.createUserOAuthAccountRepository).not.toHaveBeenCalled();
      expect(repositoryMock.createUserRepository).not.toHaveBeenCalled();

      expect(result).toEqual({
        ok: true,
        data: {
          id: "user-id",
          email: "user@example.com",
          name: "Google User",
          avatarUrl: "https://example.com/avatar.png",
          nickname: "gildong",
          role: "USER",
          status: "ACTIVE",
          createdAt: "2026-01-01T00:00:00.000Z",
          lastLoginAt: null,
        },
      });

      expect(loggerMock.info).toHaveBeenCalledWith("user.oauth_login.succeeded", {
        userId: "user-id",
        provider: "GOOGLE",
      });
    });

    it("기존 OAuth 계정 사용자가 인증 불가능한 상태면 USER_OAUTH_USER_BLOCKED 실패 Result를 반환한다", async () => {
      const blockedUser = createMockUser({
        status: "BANNED",
      });

      oauthAccountRepositoryMock.findUserOAuthAccountWithUserRepository.mockResolvedValue(
        createMockUserOAuthAccountWithUser({
          user: blockedUser,
        }),
      );

      const result = await findOrCreateOAuthUserService({
        provider: "GOOGLE",
        providerUserId: "google-user-id",
        email: "user@example.com",
        name: "Google User",
        avatarUrl: null,
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_OAUTH_USER_BLOCKED",
          message: "사용할 수 없는 계정입니다.",
        },
      });

      expect(repositoryMock.updateUserRepository).not.toHaveBeenCalled();
      expect(repositoryMock.findUserByEmailRepository).not.toHaveBeenCalled();
    });

    it("OAuth 계정은 없지만 같은 이메일 사용자가 있으면 OAuth 계정을 연결한다", async () => {
      const existingUser = createMockUser({
        id: "existing-user-id",
        email: "user@example.com",
        name: "기존 사용자",
        avatarUrl: null,
      });

      const updatedUser = createMockUser({
        id: "existing-user-id",
        email: "user@example.com",
        name: "Naver User",
        avatarUrl: "https://example.com/naver.png",
      });

      oauthAccountRepositoryMock.findUserOAuthAccountWithUserRepository.mockResolvedValue(null);
      repositoryMock.findUserByEmailRepository.mockResolvedValue(existingUser);
      repositoryMock.updateUserRepository.mockResolvedValue(updatedUser);
      oauthAccountRepositoryMock.createUserOAuthAccountRepository.mockResolvedValue({
        id: "oauth-account-id",
        email: "user@example.com",
        provider: "NAVER",
        providerUserId: "naver-user-id",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-02T00:00:00.000Z"),
        userId: "existing-user-id",
      });

      const result = await findOrCreateOAuthUserService({
        provider: "NAVER",
        providerUserId: "naver-user-id",
        email: "user@example.com",
        name: "Naver User",
        avatarUrl: "https://example.com/naver.png",
      });

      expect(repositoryMock.findUserByEmailRepository).toHaveBeenCalledWith("user@example.com");

      expect(repositoryMock.updateUserRepository).toHaveBeenCalledWith("existing-user-id", {
        name: "Naver User",
        avatarUrl: "https://example.com/naver.png",
      });

      expect(oauthAccountRepositoryMock.createUserOAuthAccountRepository).toHaveBeenCalledWith({
        email: "user@example.com",
        provider: "NAVER",
        providerUserId: "naver-user-id",
        user: {
          connect: {
            id: "existing-user-id",
          },
        },
      });

      expect(repositoryMock.createUserRepository).not.toHaveBeenCalled();

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.data.id).toBe("existing-user-id");
        expect(result.data.name).toBe("Naver User");
        expect(result.data.avatarUrl).toBe("https://example.com/naver.png");
      }

      expect(loggerMock.info).toHaveBeenCalledWith("user.oauth_account_linked.succeeded", {
        userId: "existing-user-id",
        provider: "NAVER",
      });
    });

    it("같은 이메일 사용자가 인증 불가능한 상태면 OAuth 계정을 연결하지 않는다", async () => {
      const suspendedUser = createMockUser({
        status: "SUSPENDED",
      });

      oauthAccountRepositoryMock.findUserOAuthAccountWithUserRepository.mockResolvedValue(null);
      repositoryMock.findUserByEmailRepository.mockResolvedValue(suspendedUser);

      const result = await findOrCreateOAuthUserService({
        provider: "NAVER",
        providerUserId: "naver-user-id",
        email: "user@example.com",
        name: "Naver User",
        avatarUrl: null,
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_OAUTH_USER_BLOCKED",
          message: "사용할 수 없는 계정입니다.",
        },
      });

      expect(repositoryMock.updateUserRepository).not.toHaveBeenCalled();
      expect(oauthAccountRepositoryMock.createUserOAuthAccountRepository).not.toHaveBeenCalled();
      expect(repositoryMock.createUserRepository).not.toHaveBeenCalled();
    });

    it("OAuth 계정과 같은 이메일 사용자가 없으면 신규 사용자를 생성한다", async () => {
      const createdUser = createMockUser({
        id: "new-user-id",
        email: "new-user@example.com",
        name: "Kakao User",
        avatarUrl: "https://example.com/kakao.png",
        nickname: "kakao_generated_hash",
      });

      oauthAccountRepositoryMock.findUserOAuthAccountWithUserRepository.mockResolvedValue(null);
      repositoryMock.findUserByEmailRepository.mockResolvedValue(null);
      repositoryMock.createUserRepository.mockResolvedValue(createdUser);

      const result = await findOrCreateOAuthUserService({
        provider: "KAKAO",
        providerUserId: "kakao-user-id",
        email: "new-user@example.com",
        name: "Kakao User",
        avatarUrl: "https://example.com/kakao.png",
      });

      expect(repositoryMock.createUserRepository).toHaveBeenCalledWith({
        email: "new-user@example.com",
        name: "Kakao User",
        avatarUrl: "https://example.com/kakao.png",
        nickname: expect.stringMatching(/^kakao_[a-f0-9]{16}$/),
        oauthAccounts: {
          create: {
            email: "new-user@example.com",
            provider: "KAKAO",
            providerUserId: "kakao-user-id",
          },
        },
      });

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.data.id).toBe("new-user-id");
        expect(result.data.email).toBe("new-user@example.com");
      }

      expect(loggerMock.info).toHaveBeenCalledWith("user.oauth_user_created.succeeded", {
        userId: "new-user-id",
        provider: "KAKAO",
      });
    });

    it("repository 에러가 발생하면 USER_OAUTH_LOGIN_FAILED 실패 Result를 반환하고 로그를 남긴다", async () => {
      const error = createDatabaseError();

      oauthAccountRepositoryMock.findUserOAuthAccountWithUserRepository.mockRejectedValue(error);

      const result = await findOrCreateOAuthUserService({
        provider: "GOOGLE",
        providerUserId: "google-user-id",
        email: "user@example.com",
        name: "Google User",
        avatarUrl: null,
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: "USER_OAUTH_LOGIN_FAILED",
          message: "소셜 로그인 처리 중 오류가 발생했습니다.",
          cause: error,
        },
      });

      expect(loggerMock.error).toHaveBeenCalledWith("user.oauth_login.failed", {
        provider: "GOOGLE",
        providerUserId: "google-user-id",
        error,
      });
    });
  });
});
