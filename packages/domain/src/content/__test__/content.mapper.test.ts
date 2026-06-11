import type { Content } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { toContentDetailResponse, toContentResponse } from "../content.mapper";

function createMockContent(overrides: Partial<Content> = {}): Content {
  return {
    id: "content-id",
    title: "테스트 제목",
    content: "테스트 본문",
    status: "PUBLISHED",
    authorId: "user-id",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    ...overrides,
  };
}

describe("content.mapper", () => {
  describe("toContentDetailResponse", () => {
    it("Content를 ContentDetailResponse로 변환한다", () => {
      const content = createMockContent();

      const result = toContentDetailResponse(content);

      expect(result).toEqual({
        id: "content-id",
        title: "테스트 제목",
        content: "테스트 본문",
        status: "PUBLISHED",
        authorId: "user-id",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
      });
    });
  });

  describe("toContentResponse", () => {
    it("Content를 ContentResponse로 변환한다", () => {
      const content = createMockContent();

      const result = toContentResponse(content);

      expect(result).toEqual({
        id: "content-id",
        title: "테스트 제목",
        status: "PUBLISHED",
        authorId: "user-id",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
      });
    });

    it("본문 content 필드는 목록 응답에 포함하지 않는다", () => {
      const content = createMockContent();

      const result = toContentResponse(content);

      expect(result).not.toHaveProperty("content");
    });
  });
});
