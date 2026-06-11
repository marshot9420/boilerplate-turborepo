import type { User } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AppError } from "@repo/core/errors";

import {
  getUserByIdService,
  softDeleteUserService,
  updateUserProfileService,
} from "../user.service";

const repositoryMock = vi.hoisted(() => ({
  findUserByIdRepository: vi.fn(),
  findUserByNicknameRepository: vi.fn(),
  softDeleteUserRepository: vi.fn(),
  updateUserRepository: vi.fn(),
}));

const loggerMock = vi.hoisted(() => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

vi.mock("@repo/database/user", () => repositoryMock);

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

  describe("getUserByIdService", () => {
    it("사용자를 조회하고 UserDetailResponse를 반환한다", async () => {
      const user = createMockUser();

      repositoryMock.findUserByIdRepository.mockResolvedValue(user);

      const result = await getUserByIdService("user-id");

      expect(repositoryMock.findUserByIdRepository).toHaveBeenCalledWith(
        "user-id",
      );

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

      expect(
        repositoryMock.findUserByNicknameRepository,
      ).not.toHaveBeenCalled();

      expect(repositoryMock.updateUserRepository).toHaveBeenCalledWith(
        "user-id",
        {
          name: "수정된 이름",
          avatarUrl: "https://example.com/avatar.png",
          nickname: "gildong",
        },
      );

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.data.name).toBe("수정된 이름");
        expect(result.data.avatarUrl).toBe("https://example.com/avatar.png");
        expect(result.data.nickname).toBe("gildong");
      }

      expect(loggerMock.info).toHaveBeenCalledWith(
        "user.update_profile.succeeded",
        {
          userId: "user-id",
        },
      );
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
      repositoryMock.findUserByNicknameRepository.mockResolvedValue(
        duplicatedUser,
      );

      const result = await updateUserProfileService("user-id", {
        name: "홍길동",
        avatarUrl: null,
        nickname: "new_nickname",
      });

      expect(repositoryMock.findUserByNicknameRepository).toHaveBeenCalledWith(
        "new_nickname",
      );

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

      expect(repositoryMock.findUserByNicknameRepository).toHaveBeenCalledWith(
        "new_nickname",
      );

      expect(repositoryMock.updateUserRepository).toHaveBeenCalledWith(
        "user-id",
        {
          name: null,
          avatarUrl: null,
          nickname: "new_nickname",
        },
      );

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

      expect(loggerMock.error).toHaveBeenCalledWith(
        "user.update_profile.failed",
        {
          userId: "user-id",
          error,
        },
      );
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

      expect(repositoryMock.softDeleteUserRepository).toHaveBeenCalledWith(
        "user-id",
      );

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.data.status).toBe("DELETED");
        expect(result.data.deletedAt).toBe("2026-01-03T00:00:00.000Z");
      }

      expect(loggerMock.info).toHaveBeenCalledWith(
        "user.soft_delete.succeeded",
        {
          userId: "user-id",
        },
      );
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
});
