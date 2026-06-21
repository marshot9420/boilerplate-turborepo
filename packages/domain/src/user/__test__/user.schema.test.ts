import { describe, expect, it } from "vitest";

import { USER } from "../user.constant";
import {
  DeleteMyAccountRequest,
  FindOrCreateOAuthUserRequest,
  UpdateUserProfileRequest,
  UserIdParam,
  UserListQuerySchema,
} from "../user.schema";

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

  describe("UserListQuerySchema", () => {
    it("빈 query를 허용한다", () => {
      const result = UserListQuerySchema.safeParse({});

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual({});
      }
    });

    it("page와 limit을 숫자로 변환한다", () => {
      const result = UserListQuerySchema.safeParse({
        page: "2",
        limit: "30",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(30);
      }
    });

    it("keyword 앞뒤 공백을 제거한다", () => {
      const result = UserListQuerySchema.safeParse({
        keyword: "  gildong  ",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.keyword).toBe("gildong");
      }
    });

    it("빈 keyword 문자열을 허용한다", () => {
      const result = UserListQuerySchema.safeParse({
        keyword: "   ",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.keyword).toBe("");
      }
    });

    it("role 필터를 허용한다", () => {
      const result = UserListQuerySchema.safeParse({
        role: "ADMIN",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.role).toBe("ADMIN");
      }
    });

    it("status 필터를 허용한다", () => {
      const result = UserListQuerySchema.safeParse({
        status: "SUSPENDED",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.status).toBe("SUSPENDED");
      }
    });

    it("sortKey와 sortDirection을 허용한다", () => {
      const result = UserListQuerySchema.safeParse({
        sortKey: "LAST_LOGIN_AT",
        sortDirection: "asc",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.sortKey).toBe("LAST_LOGIN_AT");
        expect(result.data.sortDirection).toBe("asc");
      }
    });

    it("허용되지 않는 role을 거부한다", () => {
      const result = UserListQuerySchema.safeParse({
        role: "SUPER_ADMIN",
      });

      expect(result.success).toBe(false);
    });

    it("허용되지 않는 status를 거부한다", () => {
      const result = UserListQuerySchema.safeParse({
        status: "PENDING",
      });

      expect(result.success).toBe(false);
    });

    it("허용되지 않는 sortKey를 거부한다", () => {
      const result = UserListQuerySchema.safeParse({
        sortKey: "ID",
      });

      expect(result.success).toBe(false);
    });

    it("허용되지 않는 sortDirection을 거부한다", () => {
      const result = UserListQuerySchema.safeParse({
        sortDirection: "ascending",
      });

      expect(result.success).toBe(false);
    });

    it("page가 1보다 작으면 실패한다", () => {
      const result = UserListQuerySchema.safeParse({
        page: "0",
      });

      expect(result.success).toBe(false);
    });

    it("limit이 100보다 크면 실패한다", () => {
      const result = UserListQuerySchema.safeParse({
        limit: "101",
      });

      expect(result.success).toBe(false);
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

  describe("FindOrCreateOAuthUserRequest", () => {
    it("올바른 OAuth 사용자 입력값을 허용한다", () => {
      const result = FindOrCreateOAuthUserRequest.safeParse({
        provider: "GOOGLE",
        providerUserId: "google-user-id",
        email: "user@example.com",
        name: "Google User",
        avatarUrl: "https://example.com/avatar.png",
      });

      expect(result.success).toBe(true);
    });

    it("name과 avatarUrl은 null을 허용한다", () => {
      const result = FindOrCreateOAuthUserRequest.safeParse({
        provider: "NAVER",
        providerUserId: "naver-user-id",
        email: "user@example.com",
        name: null,
        avatarUrl: null,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.name).toBeNull();
        expect(result.data.avatarUrl).toBeNull();
      }
    });

    it("허용되지 않는 provider를 거부한다", () => {
      const result = FindOrCreateOAuthUserRequest.safeParse({
        provider: "FACEBOOK",
        providerUserId: "facebook-user-id",
        email: "user@example.com",
        name: null,
        avatarUrl: null,
      });

      expect(result.success).toBe(false);
    });

    it("providerUserId가 비어 있으면 실패한다", () => {
      const result = FindOrCreateOAuthUserRequest.safeParse({
        provider: "GOOGLE",
        providerUserId: "",
        email: "user@example.com",
        name: null,
        avatarUrl: null,
      });

      expect(result.success).toBe(false);
    });

    it("email 형식이 올바르지 않으면 실패한다", () => {
      const result = FindOrCreateOAuthUserRequest.safeParse({
        provider: "GOOGLE",
        providerUserId: "google-user-id",
        email: "invalid-email",
        name: null,
        avatarUrl: null,
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(USER.EMAIL.INVALID_MESSAGE);
      }
    });

    it("avatarUrl 형식이 올바르지 않으면 실패한다", () => {
      const result = FindOrCreateOAuthUserRequest.safeParse({
        provider: "GOOGLE",
        providerUserId: "google-user-id",
        email: "user@example.com",
        name: null,
        avatarUrl: "invalid-url",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(USER.AVATAR_URL.INVALID_MESSAGE);
      }
    });
  });

  describe("DeleteMyAccountRequest", () => {
    it("정확한 확인 문구를 허용한다", () => {
      const result = DeleteMyAccountRequest.safeParse({
        confirmation: "회원탈퇴",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.confirmation).toBe("회원탈퇴");
      }
    });

    it("확인 문구 앞뒤 공백을 제거한다", () => {
      const result = DeleteMyAccountRequest.safeParse({
        confirmation: "  회원탈퇴  ",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.confirmation).toBe("회원탈퇴");
      }
    });

    it("확인 문구가 다르면 실패한다", () => {
      const result = DeleteMyAccountRequest.safeParse({
        confirmation: "탈퇴",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("회원탈퇴를 입력해 주세요.");
      }
    });

    it("확인 문구가 비어 있으면 실패한다", () => {
      const result = DeleteMyAccountRequest.safeParse({
        confirmation: "",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("회원탈퇴를 입력해 주세요.");
      }
    });
  });
});
