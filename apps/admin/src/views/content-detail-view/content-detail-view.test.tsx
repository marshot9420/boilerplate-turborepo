import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ContentDetailResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";

import ContentDetailView from "./content-detail-view";

const contentResponse = {
  id: "content-id",
  title: "관리자 콘텐츠 상세 제목",
  content: "관리자 콘텐츠 상세 본문입니다.",
  status: "PUBLISHED",
  authorId: "author-id",
  createdAt: "2026-06-20T00:00:00.000Z",
  updatedAt: "2026-06-20T01:00:00.000Z",
} satisfies ContentDetailResponse;

describe("ContentDetailView", () => {
  it("콘텐츠 상세 조회 성공 화면을 렌더링한다", () => {
    render(<ContentDetailView content={contentResponse} />);

    expect(screen.getByRole("heading", { name: "콘텐츠 상세" })).toBeInTheDocument();
    expect(screen.getByText("콘텐츠 상세 정보를 조회합니다.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "관리자 콘텐츠 상세 제목" })).toBeInTheDocument();
    expect(screen.getByText("관리자 콘텐츠 상세 본문입니다.")).toBeInTheDocument();
  });

  it("콘텐츠 상세 조회 실패 화면을 렌더링한다", () => {
    render(<ContentDetailView errorMessage="콘텐츠를 불러오지 못했습니다." />);

    expect(screen.getByRole("heading", { name: "콘텐츠 상세" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "콘텐츠를 불러오지 못했습니다." }),
    ).toBeInTheDocument();
    expect(screen.getByText("콘텐츠를 불러오지 못했습니다.")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "목록으로 돌아가기" })).toHaveAttribute(
      "href",
      URLS.CLIENT.CONTENTS,
    );
  });

  it("실패 메시지가 없으면 기본 실패 메시지를 렌더링한다", () => {
    render(<ContentDetailView />);

    expect(
      screen.getByRole("heading", { name: "콘텐츠를 불러오지 못했습니다." }),
    ).toBeInTheDocument();
    expect(screen.getByText("콘텐츠를 불러오는 중 오류가 발생했습니다.")).toBeInTheDocument();
  });
});
