import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ContentResponse } from "@repo/domain/content/client";

import ContentCard from "./content-card";
import { formatContentDate } from "../../lib";

const content = {
  id: "content-id",
  title: "샘플 콘텐츠",
  status: "PUBLISHED",
  authorId: "author-id",
  createdAt: "2026-06-18T12:00:00.000Z",
  updatedAt: "2026-06-18T12:00:00.000Z",
} satisfies ContentResponse;

describe("ContentCard", () => {
  it("콘텐츠 제목을 렌더링한다", () => {
    render(<ContentCard content={content} />);

    expect(screen.getByRole("heading", { name: "샘플 콘텐츠" })).toBeInTheDocument();
  });

  it("콘텐츠 생성일을 렌더링한다", () => {
    render(<ContentCard content={content} />);

    expect(screen.getByText(formatContentDate(content.createdAt))).toBeInTheDocument();
  });

  it("콘텐츠 상태 라벨을 렌더링한다", () => {
    render(<ContentCard content={content} />);

    expect(screen.getByText("공개")).toBeInTheDocument();
  });

  it("작성자 식별자를 렌더링한다", () => {
    render(<ContentCard content={content} />);

    expect(screen.getByText("작성자 author-id")).toBeInTheDocument();
  });

  it("article 랜드마크를 렌더링한다", () => {
    render(<ContentCard content={content} />);

    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("콘텐츠 상세 페이지 링크를 렌더링한다", () => {
    render(<ContentCard content={content} />);

    expect(
      screen.getByRole("link", {
        name: "콘텐츠 제목 상세 보기",
      }),
    ).toHaveAttribute("href", `/contents/${content.id}`);
  });
});
