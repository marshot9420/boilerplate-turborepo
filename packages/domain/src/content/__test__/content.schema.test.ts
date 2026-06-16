import { describe, expect, it } from "vitest";

import { CONTENT } from "../content.constant";
import {
  ContentIdParam,
  CreateContentRequest,
  UpdateContentByIdRequest,
  UpdateContentRequest,
  UpdateContentStatusByIdRequest,
  UpdateContentStatusRequest,
} from "../content.schema";

describe("content.schema", () => {
  describe("ContentIdParam", () => {
    it("올바른 UUID를 허용한다", () => {
      const result = ContentIdParam.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
      });

      expect(result.success).toBe(true);
    });

    it("올바르지 않은 UUID를 거부한다", () => {
      const result = ContentIdParam.safeParse({
        id: "invalid-id",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(CONTENT.ID.INVALID_MESSAGE);
      }
    });
  });

  describe("CreateContentRequest", () => {
    it("올바른 콘텐츠 생성 입력값을 허용한다", () => {
      const result = CreateContentRequest.safeParse({
        title: "테스트 제목",
        content: "테스트 본문",
      });

      expect(result.success).toBe(true);
    });

    it("title과 content 앞뒤 공백을 제거한다", () => {
      const result = CreateContentRequest.safeParse({
        title: "  테스트 제목  ",
        content: "  테스트 본문  ",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.title).toBe("테스트 제목");
        expect(result.data.content).toBe("테스트 본문");
      }
    });

    it("title이 비어 있으면 실패한다", () => {
      const result = CreateContentRequest.safeParse({
        title: "",
        content: "테스트 본문",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(CONTENT.TITLE.REQUIRED_MESSAGE);
      }
    });

    it("title이 최대 길이를 초과하면 실패한다", () => {
      const result = CreateContentRequest.safeParse({
        title: "가".repeat(CONTENT.TITLE.MAX_LENGTH + 1),
        content: "테스트 본문",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(CONTENT.TITLE.MAX_MESSAGE);
      }
    });

    it("content가 비어 있으면 실패한다", () => {
      const result = CreateContentRequest.safeParse({
        title: "테스트 제목",
        content: "",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(CONTENT.BODY.REQUIRED_MESSAGE);
      }
    });
  });

  describe("UpdateContentRequest", () => {
    it("빈 객체를 거부한다", () => {
      const result = UpdateContentRequest.safeParse({});

      expect(result.success).toBe(false);
    });

    it("부분 수정 입력값을 허용한다", () => {
      const result = UpdateContentRequest.safeParse({
        title: "수정된 제목",
      });

      expect(result.success).toBe(true);
    });

    it("title과 content 앞뒤 공백을 제거한다", () => {
      const result = UpdateContentRequest.safeParse({
        title: "  수정된 제목  ",
        content: "  수정된 본문  ",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.title).toBe("수정된 제목");
        expect(result.data.content).toBe("수정된 본문");
      }
    });

    it("status는 수정 입력값으로 허용하지 않는다", () => {
      const result = UpdateContentRequest.safeParse({
        status: "HIDDEN",
      });

      expect(result.success).toBe(false);
    });

    it("title이 비어 있으면 실패한다", () => {
      const result = UpdateContentRequest.safeParse({
        title: "",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(CONTENT.TITLE.MIN_MESSAGE);
      }
    });

    it("content가 비어 있으면 실패한다", () => {
      const result = UpdateContentRequest.safeParse({
        content: "",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(CONTENT.BODY.MIN_MESSAGE);
      }
    });
  });

  describe("UpdateContentByIdRequest", () => {
    it("id와 수정 입력값을 함께 허용한다", () => {
      const result = UpdateContentByIdRequest.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        title: "수정된 제목",
      });

      expect(result.success).toBe(true);
    });

    it("id가 UUID가 아니면 실패한다", () => {
      const result = UpdateContentByIdRequest.safeParse({
        id: "invalid-id",
        title: "수정된 제목",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(CONTENT.ID.INVALID_MESSAGE);
      }
    });
  });

  describe("UpdateContentStatusRequest", () => {
    it("PUBLISHED 상태를 허용한다", () => {
      const result = UpdateContentStatusRequest.safeParse({
        status: "PUBLISHED",
      });

      expect(result.success).toBe(true);
    });

    it("HIDDEN 상태를 허용한다", () => {
      const result = UpdateContentStatusRequest.safeParse({
        status: "HIDDEN",
      });

      expect(result.success).toBe(true);
    });

    it("DELETED 상태는 상태 변경 요청에서 허용하지 않는다", () => {
      const result = UpdateContentStatusRequest.safeParse({
        status: "DELETED",
      });

      expect(result.success).toBe(false);
    });

    it("허용되지 않는 status를 거부한다", () => {
      const result = UpdateContentStatusRequest.safeParse({
        status: "INVALID_STATUS",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("UpdateContentStatusByIdRequest", () => {
    it("id와 status를 함께 허용한다", () => {
      const result = UpdateContentStatusByIdRequest.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        status: "HIDDEN",
      });

      expect(result.success).toBe(true);
    });

    it("id가 UUID가 아니면 실패한다", () => {
      const result = UpdateContentStatusByIdRequest.safeParse({
        id: "invalid-id",
        status: "HIDDEN",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(CONTENT.ID.INVALID_MESSAGE);
      }
    });
  });
});
