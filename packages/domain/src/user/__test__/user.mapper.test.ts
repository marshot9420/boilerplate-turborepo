import type { User } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { toUserDetailResponse, toUserResponse } from "../user.mapper";

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
});
