import { describe, expect, it } from "vitest";

import { USER } from "../user.constant";
import { UpdateUserProfileRequest, UserIdParam } from "../user.schema";

describe("user.schema", () => {
  describe("UserIdParam", () => {
    it("올바른 UUID를 허용한다", () => {
      const result = UserIdParam.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
      });

      expect(result.success).toBe(true);
    });

    it("올바르지 않은 UUID를 거부한다", () => {
      const result = UserIdParam.safeParse({
        id: "invalid-id",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(USER.ID.INVALID_MESSAGE);
      }
    });
  });

  describe("UpdateUserProfileRequest", () => {
    it("올바른 프로필 수정 입력값을 허용한다", () => {
      const result = UpdateUserProfileRequest.safeParse({
        name: "홍길동",
        avatarUrl: "https://example.com/avatar.png",
        nickname: "gildong_123",
      });

      expect(result.success).toBe(true);
    });

    it("nickname 앞뒤 공백을 제거한다", () => {
      const result = UpdateUserProfileRequest.safeParse({
        name: "홍길동",
        avatarUrl: null,
        nickname: "  gildong  ",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.nickname).toBe("gildong");
      }
    });

    it("name은 null을 허용한다", () => {
      const result = UpdateUserProfileRequest.safeParse({
        name: null,
        avatarUrl: null,
        nickname: "gildong",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.name).toBeNull();
      }
    });

    it("avatarUrl은 null을 허용한다", () => {
      const result = UpdateUserProfileRequest.safeParse({
        name: "홍길동",
        avatarUrl: null,
        nickname: "gildong",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.avatarUrl).toBeNull();
      }
    });

    it("name이 최대 길이를 초과하면 실패한다", () => {
      const result = UpdateUserProfileRequest.safeParse({
        name: "가".repeat(USER.NAME.MAX_LENGTH + 1),
        avatarUrl: null,
        nickname: "gildong",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(USER.NAME.MAX_MESSAGE);
      }
    });

    it("avatarUrl 형식이 올바르지 않으면 실패한다", () => {
      const result = UpdateUserProfileRequest.safeParse({
        name: "홍길동",
        avatarUrl: "invalid-url",
        nickname: "gildong",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(USER.AVATAR_URL.INVALID_MESSAGE);
      }
    });

    it("nickname이 최소 길이보다 짧으면 실패한다", () => {
      const result = UpdateUserProfileRequest.safeParse({
        name: "홍길동",
        avatarUrl: null,
        nickname: "a",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(USER.NICKNAME.MIN_MESSAGE);
      }
    });

    it("nickname이 최대 길이를 초과하면 실패한다", () => {
      const result = UpdateUserProfileRequest.safeParse({
        name: "홍길동",
        avatarUrl: null,
        nickname: "a".repeat(USER.NICKNAME.MAX_LENGTH + 1),
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(USER.NICKNAME.MAX_MESSAGE);
      }
    });

    it("nickname에 허용되지 않는 문자가 있으면 실패한다", () => {
      const result = UpdateUserProfileRequest.safeParse({
        name: "홍길동",
        avatarUrl: null,
        nickname: "bad-nickname!",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(USER.NICKNAME.INVALID_MESSAGE);
      }
    });
  });
});
