import type { User } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { toUserDetailResponse, toUserListItemResponse, toUserResponse } from "../user.mapper";

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

describe("user.mapper", () => {
  describe("toUserDetailResponse", () => {
    it("User를 UserDetailResponse로 변환한다", () => {
      const user = createMockUser({
        lastLoginAt: new Date("2026-01-03T00:00:00.000Z"),
        deletedAt: new Date("2026-01-04T00:00:00.000Z"),
      });

      const result = toUserDetailResponse(user);

      expect(result).toEqual({
        id: "user-id",
        email: "user@example.com",
        name: "홍길동",
        avatarUrl: null,
        nickname: "gildong",
        role: "USER",
        status: "ACTIVE",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
        lastLoginAt: "2026-01-03T00:00:00.000Z",
        deletedAt: "2026-01-04T00:00:00.000Z",
      });
    });

    it("nullable date 필드를 null로 변환한다", () => {
      const user = createMockUser({
        lastLoginAt: null,
        deletedAt: null,
      });

      const result = toUserDetailResponse(user);

      expect(result.lastLoginAt).toBeNull();
      expect(result.deletedAt).toBeNull();
    });
  });

  describe("toUserResponse", () => {
    it("User를 UserResponse로 변환한다", () => {
      const user = createMockUser({
        lastLoginAt: new Date("2026-01-03T00:00:00.000Z"),
      });

      const result = toUserResponse(user);

      expect(result).toEqual({
        id: "user-id",
        email: "user@example.com",
        name: "홍길동",
        avatarUrl: null,
        nickname: "gildong",
        role: "USER",
        status: "ACTIVE",
        createdAt: "2026-01-01T00:00:00.000Z",
        lastLoginAt: "2026-01-03T00:00:00.000Z",
      });
    });

    it("lastLoginAt이 null이면 null로 변환한다", () => {
      const user = createMockUser({
        lastLoginAt: null,
      });

      const result = toUserResponse(user);

      expect(result.lastLoginAt).toBeNull();
    });
  });

  describe("toUserListItemResponse", () => {
    it("User를 UserListItemResponse로 변환한다", () => {
      const user = createMockUser({
        id: "user-list-id",
        email: "list@example.com",
        name: "목록 사용자",
        avatarUrl: "https://example.com/avatar.png",
        nickname: "list_user",
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: new Date("2026-01-05T00:00:00.000Z"),
        updatedAt: new Date("2026-01-06T00:00:00.000Z"),
        lastLoginAt: new Date("2026-01-07T00:00:00.000Z"),
        deletedAt: new Date("2026-01-08T00:00:00.000Z"),
      });

      const result = toUserListItemResponse(user);

      expect(result).toEqual({
        id: "user-list-id",
        email: "list@example.com",
        name: "목록 사용자",
        avatarUrl: "https://example.com/avatar.png",
        nickname: "list_user",
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: "2026-01-05T00:00:00.000Z",
        lastLoginAt: "2026-01-07T00:00:00.000Z",
      });
    });

    it("lastLoginAt이 null이면 null로 변환한다", () => {
      const user = createMockUser({
        lastLoginAt: null,
      });

      const result = toUserListItemResponse(user);

      expect(result.lastLoginAt).toBeNull();
    });

    it("목록 응답에는 updatedAt과 deletedAt을 포함하지 않는다", () => {
      const user = createMockUser({
        updatedAt: new Date("2026-01-06T00:00:00.000Z"),
        deletedAt: new Date("2026-01-07T00:00:00.000Z"),
      });

      const result = toUserListItemResponse(user);

      expect(result).not.toHaveProperty("updatedAt");
      expect(result).not.toHaveProperty("deletedAt");
    });
  });
});
