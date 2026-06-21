import { describe, expect, it } from "vitest";

import {
  canAuthenticateUser,
  canManageUsers,
  canReadUser,
  canUpdateUser,
  type UserPermissionActor,
} from "../user.permission";

function createActor(overrides: Partial<UserPermissionActor> = {}): UserPermissionActor {
  return {
    id: "user-id",
    role: "USER",
    status: "ACTIVE",
    ...overrides,
  };
}

describe("user.permission", () => {
  describe("canReadUser", () => {
    it("ADMIN은 다른 사용자를 조회할 수 있다", () => {
      const actor = createActor({
        role: "ADMIN",
      });

      expect(canReadUser(actor, "target-user-id")).toBe(true);
    });

    it("일반 사용자는 본인을 조회할 수 있다", () => {
      const actor = createActor({
        id: "user-id",
        role: "USER",
      });

      expect(canReadUser(actor, "user-id")).toBe(true);
    });

    it("일반 사용자는 다른 사용자를 조회할 수 없다", () => {
      const actor = createActor({
        id: "user-id",
        role: "USER",
      });

      expect(canReadUser(actor, "target-user-id")).toBe(false);
    });
  });

  describe("canUpdateUser", () => {
    it("ACTIVE ADMIN은 다른 사용자를 수정할 수 있다", () => {
      const actor = createActor({
        role: "ADMIN",
        status: "ACTIVE",
      });

      expect(canUpdateUser(actor, "target-user-id")).toBe(true);
    });

    it("ACTIVE 일반 사용자는 본인을 수정할 수 있다", () => {
      const actor = createActor({
        id: "user-id",
        role: "USER",
        status: "ACTIVE",
      });

      expect(canUpdateUser(actor, "user-id")).toBe(true);
    });

    it("ACTIVE 일반 사용자는 다른 사용자를 수정할 수 없다", () => {
      const actor = createActor({
        id: "user-id",
        role: "USER",
        status: "ACTIVE",
      });

      expect(canUpdateUser(actor, "target-user-id")).toBe(false);
    });

    it("ACTIVE 상태가 아니면 ADMIN이어도 수정할 수 없다", () => {
      const actor = createActor({
        role: "ADMIN",
        status: "SUSPENDED",
      });

      expect(canUpdateUser(actor, "target-user-id")).toBe(false);
    });
  });

  describe("canManageUsers", () => {
    it("ACTIVE ADMIN은 사용자를 관리할 수 있다", () => {
      const actor = createActor({
        role: "ADMIN",
        status: "ACTIVE",
      });

      expect(canManageUsers(actor)).toBe(true);
    });

    it("일반 사용자는 사용자를 관리할 수 없다", () => {
      const actor = createActor({
        role: "USER",
        status: "ACTIVE",
      });

      expect(canManageUsers(actor)).toBe(false);
    });

    it("ACTIVE 상태가 아닌 ADMIN은 사용자를 관리할 수 없다", () => {
      const actor = createActor({
        role: "ADMIN",
        status: "BANNED",
      });

      expect(canManageUsers(actor)).toBe(false);
    });
  });

  describe("canAuthenticateUser", () => {
    it("ACTIVE 상태이고 deletedAt이 없으면 인증할 수 있다", () => {
      expect(
        canAuthenticateUser({
          status: "ACTIVE",
          deletedAt: null,
        }),
      ).toBe(true);
    });

    it("ACTIVE 상태이고 deletedAt이 undefined여도 인증할 수 있다", () => {
      expect(
        canAuthenticateUser({
          status: "ACTIVE",
        }),
      ).toBe(true);
    });

    it("SUSPENDED 상태이면 인증할 수 없다", () => {
      expect(
        canAuthenticateUser({
          status: "SUSPENDED",
          deletedAt: null,
        }),
      ).toBe(false);
    });

    it("BANNED 상태이면 인증할 수 없다", () => {
      expect(
        canAuthenticateUser({
          status: "BANNED",
          deletedAt: null,
        }),
      ).toBe(false);
    });

    it("DELETED 상태이면 인증할 수 없다", () => {
      expect(
        canAuthenticateUser({
          status: "DELETED",
          deletedAt: new Date("2026-01-01T00:00:00.000Z"),
        }),
      ).toBe(false);
    });

    it("ACTIVE 상태여도 deletedAt이 있으면 인증할 수 없다", () => {
      expect(
        canAuthenticateUser({
          status: "ACTIVE",
          deletedAt: new Date("2026-01-01T00:00:00.000Z"),
        }),
      ).toBe(false);
    });
  });
});
