import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ContentResponse } from "@repo/domain/content/client";

import ContentList from "./content-list";

function createContent(overrides: Partial<ContentResponse> = {}): ContentResponse {
  return {
    id: "content-id",
    title: "샘플 콘텐츠",
    status: "PUBLISHED",
    authorId: "author-id",
    createdAt: "2026-06-18T12:00:00.000Z",
    updatedAt: "2026-06-18T12:00:00.000Z",
    ...overrides,
  };
}

describe("ContentList", () => {
  it("콘텐츠가 없으면 빈 상태를 렌더링한다", () => {
    render(<ContentList contents={[]} />);

    expect(
      screen.getByRole("heading", {
        name: "등록된 콘텐츠가 없습니다.",
      }),
    ).toBeInTheDocument();
  });

  it("콘텐츠 목록을 렌더링한다", () => {
    const contents = [
      createContent({
        id: "content-1",
        title: "첫 번째 콘텐츠",
      }),
      createContent({
        id: "content-2",
        title: "두 번째 콘텐츠",
      }),
    ];

    render(<ContentList contents={contents} />);

    expect(screen.getByRole("heading", { name: "첫 번째 콘텐츠" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "두 번째 콘텐츠" })).toBeInTheDocument();
  });

  it("콘텐츠 수만큼 article을 렌더링한다", () => {
    const contents = [
      createContent({
        id: "content-1",
        title: "첫 번째 콘텐츠",
      }),
      createContent({
        id: "content-2",
        title: "두 번째 콘텐츠",
      }),
      createContent({
        id: "content-3",
        title: "세 번째 콘텐츠",
      }),
    ];

    render(<ContentList contents={contents} />);

    expect(screen.getAllByRole("article")).toHaveLength(3);
  });
});
