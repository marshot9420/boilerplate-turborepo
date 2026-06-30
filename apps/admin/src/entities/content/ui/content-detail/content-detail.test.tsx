import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ContentDetailResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";

import ContentDetail from "./content-detail";
import { formatContentDate } from "../../lib";

const contentResponse = {
  id: "content-id",
  title: "관리자 콘텐츠 상세 제목",
  content: "관리자 콘텐츠 상세 본문입니다.\n두 번째 줄입니다.",
  status: "PUBLISHED",
  authorId: "author-id",
  createdAt: "2026-06-20T00:00:00.000Z",
  updatedAt: "2026-06-20T01:00:00.000Z",
} satisfies ContentDetailResponse;

describe("ContentDetail", () => {
  it("콘텐츠 상세 헤더를 렌더링한다", () => {
    render(<ContentDetail content={contentResponse} />);

    expect(screen.getByRole("heading", { name: "콘텐츠 상세" })).toBeInTheDocument();
    expect(screen.getByText("콘텐츠 상세 정보를 조회합니다.")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "목록으로 돌아가기" })).toHaveAttribute(
      "href",
      URLS.CLIENT.CONTENTS,
    );
  });

  it("콘텐츠 제목과 식별자를 렌더링한다", () => {
    render(<ContentDetail content={contentResponse} />);

    expect(screen.getByRole("heading", { name: "관리자 콘텐츠 상세 제목" })).toBeInTheDocument();
    expect(screen.getByText("content-id")).toBeInTheDocument();
  });

  it("콘텐츠 상태와 메타 정보를 렌더링한다", () => {
    render(<ContentDetail content={contentResponse} />);

    expect(screen.getAllByText("공개").length).toBeGreaterThan(0);
    expect(screen.getByText("author-id")).toBeInTheDocument();
    expect(screen.getByText(formatContentDate(contentResponse.createdAt))).toBeInTheDocument();
    expect(screen.getByText(formatContentDate(contentResponse.updatedAt))).toBeInTheDocument();
  });

  it("콘텐츠 본문을 렌더링한다", () => {
    render(<ContentDetail content={contentResponse} />);

    expect(screen.getByRole("heading", { name: "본문" })).toBeInTheDocument();
    expect(screen.getByText(/관리자 콘텐츠 상세 본문입니다./)).toBeInTheDocument();
    expect(screen.getByText(/두 번째 줄입니다./)).toBeInTheDocument();
  });
});
