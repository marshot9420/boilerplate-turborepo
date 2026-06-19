import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ContentDetailResponse } from "@repo/domain/content/client";

import ContentDetail from "./content-detail";

const content: ContentDetailResponse = {
  id: "content-id",
  title: "콘텐츠 상세 제목",
  content: "첫 번째 문단입니다.\n두 번째 문단입니다.",
  status: "PUBLISHED",
  authorId: "author-id",
  createdAt: "2026-06-18T10:00:00.000Z",
  updatedAt: "2026-06-18T12:00:00.000Z",
};

describe("ContentDetail", () => {
  it("콘텐츠 제목과 본문을 렌더링한다", () => {
    render(<ContentDetail content={content} />);

    expect(
      screen.getByRole("heading", {
        name: "콘텐츠 상세 제목",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/첫 번째 문단입니다/)).toBeInTheDocument();
    expect(screen.getByText(/두 번째 문단입니다/)).toBeInTheDocument();
  });

  it("콘텐츠 상태 라벨을 렌더링한다", () => {
    render(<ContentDetail content={content} />);

    expect(screen.getByText("공개")).toBeInTheDocument();
  });

  it("작성자 식별자를 렌더링한다", () => {
    render(<ContentDetail content={content} />);

    expect(screen.getByText("author-id")).toBeInTheDocument();
  });

  it("목록으로 돌아가기 링크를 렌더링한다", () => {
    render(<ContentDetail content={content} />);

    expect(
      screen.getByRole("link", {
        name: "목록으로 돌아가기",
      }),
    ).toHaveAttribute("href", "/contents");
  });

  it("backHref를 전달하면 목록으로 돌아가기 링크 경로로 사용한다", () => {
    render(<ContentDetail content={content} backHref="/" />);

    expect(
      screen.getByRole("link", {
        name: "목록으로 돌아가기",
      }),
    ).toHaveAttribute("href", "/");
  });

  it("editHref가 없으면 수정 링크를 렌더링하지 않는다", () => {
    render(<ContentDetail content={content} />);

    expect(
      screen.queryByRole("link", {
        name: "수정",
      }),
    ).not.toBeInTheDocument();
  });

  it("editHref가 있으면 수정 링크를 렌더링한다", () => {
    render(<ContentDetail content={content} editHref="/contents/content-id/edit" />);

    expect(
      screen.getByRole("link", {
        name: "수정",
      }),
    ).toHaveAttribute("href", "/contents/content-id/edit");
  });

  it("actions가 있으면 액션 영역을 렌더링한다", () => {
    render(<ContentDetail content={content} actions={<button type="button">삭제 액션</button>} />);

    expect(
      screen.getByRole("button", {
        name: "삭제 액션",
      }),
    ).toBeInTheDocument();
  });
});
