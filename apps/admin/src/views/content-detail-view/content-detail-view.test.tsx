import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { ContentDetailResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";

import ContentDetailView from "./content-detail-view";

vi.mock("@/actions/content", () => ({
  deleteContentAction: vi.fn(),
  updateContentStatusAction: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    replace: vi.fn(),
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@repo/design-system/toast", () => ({
  toastActionResult: vi.fn(),
}));

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
  it("콘텐츠 상세 조회 성공 화면과 관리 작업 영역을 렌더링한다", () => {
    render(<ContentDetailView content={contentResponse} />);

    expect(screen.getByRole("heading", { name: "콘텐츠 상세" })).toBeInTheDocument();
    expect(screen.getByText("콘텐츠 상세 정보를 조회합니다.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "관리자 콘텐츠 상세 제목" })).toBeInTheDocument();
    expect(screen.getByText("관리자 콘텐츠 상세 본문입니다.")).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "관리 작업" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "상태 변경" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "콘텐츠 삭제" })).toBeInTheDocument();
  });

  it("콘텐츠 상세 조회 실패 화면을 렌더링한다", () => {
    render(<ContentDetailView errorMessage="일시적인 오류로 콘텐츠를 불러오지 못했습니다." />);

    expect(screen.getByRole("heading", { name: "콘텐츠 상세" })).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "콘텐츠를 불러오지 못했습니다.",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("일시적인 오류로 콘텐츠를 불러오지 못했습니다.")).toBeInTheDocument();

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
