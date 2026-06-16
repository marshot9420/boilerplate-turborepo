import { describe, expect, it } from "vitest";

import {
  canCreateContent,
  canDeleteContent,
  canReadContent,
  canUpdateContent,
  canUpdateContentStatus,
  type ContentPermissionActor,
} from "../content.permission";

function createActor(overrides: Partial<ContentPermissionActor> = {}): ContentPermissionActor {
  return {
    id: "user-id",
    role: "USER",
    status: "ACTIVE",
    ...overrides,
  };
}

describe("content.permission", () => {
  describe("canCreateContent", () => {
    it("ACTIVE 사용자는 콘텐츠를 생성할 수 있다", () => {
      const actor = createActor({
        status: "ACTIVE",
      });

      expect(canCreateContent(actor)).toBe(true);
    });

    it("ACTIVE 상태가 아니면 콘텐츠를 생성할 수 없다", () => {
      const actor = createActor({
        status: "SUSPENDED",
      });

      expect(canCreateContent(actor)).toBe(false);
    });
  });

  describe("canReadContent", () => {
    it("PUBLISHED 콘텐츠는 비로그인 사용자도 조회할 수 있다", () => {
      expect(
        canReadContent(null, {
          authorId: "author-id",
          status: "PUBLISHED",
        }),
      ).toBe(true);
    });

    it("HIDDEN 콘텐츠는 비로그인 사용자가 조회할 수 없다", () => {
      expect(
        canReadContent(null, {
          authorId: "author-id",
          status: "HIDDEN",
        }),
      ).toBe(false);
    });

    it("ADMIN은 HIDDEN 콘텐츠를 조회할 수 있다", () => {
      const actor = createActor({
        role: "ADMIN",
      });

      expect(
        canReadContent(actor, {
          authorId: "author-id",
          status: "HIDDEN",
        }),
      ).toBe(true);
    });

    it("작성자는 본인의 HIDDEN 콘텐츠를 조회할 수 있다", () => {
      const actor = createActor({
        id: "author-id",
        role: "USER",
      });

      expect(
        canReadContent(actor, {
          authorId: "author-id",
          status: "HIDDEN",
        }),
      ).toBe(true);
    });

    it("일반 사용자는 다른 사람의 HIDDEN 콘텐츠를 조회할 수 없다", () => {
      const actor = createActor({
        id: "user-id",
        role: "USER",
      });

      expect(
        canReadContent(actor, {
          authorId: "author-id",
          status: "HIDDEN",
        }),
      ).toBe(false);
    });

    it("ADMIN은 DELETED 콘텐츠를 조회할 수 있다", () => {
      const actor = createActor({
        role: "ADMIN",
      });

      expect(
        canReadContent(actor, {
          authorId: "author-id",
          status: "DELETED",
        }),
      ).toBe(true);
    });

    it("작성자도 본인의 DELETED 콘텐츠는 조회할 수 없다", () => {
      const actor = createActor({
        id: "author-id",
        role: "USER",
      });

      expect(
        canReadContent(actor, {
          authorId: "author-id",
          status: "DELETED",
        }),
      ).toBe(false);
    });
  });

  describe("canUpdateContent", () => {
    it("ACTIVE ADMIN은 다른 사람의 콘텐츠를 수정할 수 있다", () => {
      const actor = createActor({
        role: "ADMIN",
        status: "ACTIVE",
      });

      expect(
        canUpdateContent(actor, {
          authorId: "author-id",
        }),
      ).toBe(true);
    });

    it("ACTIVE 작성자는 본인의 콘텐츠를 수정할 수 있다", () => {
      const actor = createActor({
        id: "author-id",
        role: "USER",
        status: "ACTIVE",
      });

      expect(
        canUpdateContent(actor, {
          authorId: "author-id",
        }),
      ).toBe(true);
    });

    it("ACTIVE 일반 사용자는 다른 사람의 콘텐츠를 수정할 수 없다", () => {
      const actor = createActor({
        id: "user-id",
        role: "USER",
        status: "ACTIVE",
      });

      expect(
        canUpdateContent(actor, {
          authorId: "author-id",
        }),
      ).toBe(false);
    });

    it("ACTIVE 상태가 아니면 ADMIN이어도 콘텐츠를 수정할 수 없다", () => {
      const actor = createActor({
        role: "ADMIN",
        status: "BANNED",
      });

      expect(
        canUpdateContent(actor, {
          authorId: "author-id",
        }),
      ).toBe(false);
    });
  });

  describe("canDeleteContent", () => {
    it("ACTIVE ADMIN은 다른 사람의 콘텐츠를 삭제할 수 있다", () => {
      const actor = createActor({
        role: "ADMIN",
        status: "ACTIVE",
      });

      expect(
        canDeleteContent(actor, {
          authorId: "author-id",
        }),
      ).toBe(true);
    });

    it("ACTIVE 작성자는 본인의 콘텐츠를 삭제할 수 있다", () => {
      const actor = createActor({
        id: "author-id",
        role: "USER",
        status: "ACTIVE",
      });

      expect(
        canDeleteContent(actor, {
          authorId: "author-id",
        }),
      ).toBe(true);
    });

    it("ACTIVE 일반 사용자는 다른 사람의 콘텐츠를 삭제할 수 없다", () => {
      const actor = createActor({
        id: "user-id",
        role: "USER",
        status: "ACTIVE",
      });

      expect(
        canDeleteContent(actor, {
          authorId: "author-id",
        }),
      ).toBe(false);
    });

    it("ACTIVE 상태가 아니면 ADMIN이어도 콘텐츠를 삭제할 수 없다", () => {
      const actor = createActor({
        role: "ADMIN",
        status: "SUSPENDED",
      });

      expect(
        canDeleteContent(actor, {
          authorId: "author-id",
        }),
      ).toBe(false);
    });
  });

  describe("canUpdateContentStatus", () => {
    it("ACTIVE ADMIN은 콘텐츠 상태를 변경할 수 있다", () => {
      const actor = createActor({
        role: "ADMIN",
        status: "ACTIVE",
      });

      expect(canUpdateContentStatus(actor)).toBe(true);
    });

    it("USER는 ACTIVE 상태여도 콘텐츠 상태를 변경할 수 없다", () => {
      const actor = createActor({
        role: "USER",
        status: "ACTIVE",
      });

      expect(canUpdateContentStatus(actor)).toBe(false);
    });

    it("ADMIN이어도 ACTIVE 상태가 아니면 콘텐츠 상태를 변경할 수 없다", () => {
      const actor = createActor({
        role: "ADMIN",
        status: "SUSPENDED",
      });

      expect(canUpdateContentStatus(actor)).toBe(false);
    });
  });
});
