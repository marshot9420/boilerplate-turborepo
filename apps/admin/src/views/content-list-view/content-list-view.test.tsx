import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ActionResult } from "@repo/core/action";
import type { ContentListResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";

import ContentListView from "./content-list-view";

describe("ContentListView", () => {
  const contentListResponse: ContentListResponse = {
    items: [
      {
        id: "content-id",
        title: "테스트 콘텐츠",
        status: "PUBLISHED",
        authorId: "author-id",
        createdAt: "2026-06-20T00:00:00.000Z",
        updatedAt: "2026-06-20T01:00:00.000Z",
      },
    ],
    meta: {
      page: 1,
      limit: 20,
      totalCount: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  it("콘텐츠 목록 조회 성공 화면을 렌더링한다", () => {
    const result: ActionResult<ContentListResponse> = {
      ok: true,
      data: contentListResponse,
    };

    render(<ContentListView result={result} />);

    expect(screen.getByRole("heading", { name: "콘텐츠 관리" })).toBeInTheDocument();
    expect(screen.getByText("콘텐츠 목록을 조회하고 관리합니다.")).toBeInTheDocument();
    expect(screen.getByText("총 1개")).toBeInTheDocument();

    const table = screen.getByRole("table");

    expect(within(table).getByText("테스트 콘텐츠")).toBeInTheDocument();
    expect(within(table).getByText("공개")).toBeInTheDocument();
  });

  it("콘텐츠 목록이 비어 있으면 empty state를 렌더링한다", () => {
    const result: ActionResult<ContentListResponse> = {
      ok: true,
      data: {
        items: [],
        meta: {
          page: 1,
          limit: 20,
          totalCount: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    };

    render(<ContentListView result={result} />);

    expect(screen.getByText("등록된 콘텐츠가 없습니다.")).toBeInTheDocument();
  });

  it("필터가 적용된 상태에서 목록이 비어 있으면 filtered empty state를 렌더링한다", () => {
    const result: ActionResult<ContentListResponse> = {
      ok: true,
      data: {
        items: [],
        meta: {
          page: 1,
          limit: 20,
          totalCount: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    };

    render(
      <ContentListView
        result={result}
        searchParams={{
          status: "HIDDEN",
        }}
      />,
    );

    expect(screen.getByText("조건에 맞는 콘텐츠가 없습니다.")).toBeInTheDocument();
  });

  it("콘텐츠 목록 조회 실패 화면을 렌더링한다", () => {
    const result: ActionResult<ContentListResponse> = {
      ok: false,
      code: "DATABASE_UNKNOWN_ERROR",
      message: "콘텐츠 목록 조회 중 오류가 발생했습니다.",
    };

    render(<ContentListView result={result} />);

    expect(screen.getByText("콘텐츠 목록을 불러오지 못했습니다.")).toBeInTheDocument();
    expect(screen.getByText("콘텐츠 목록 조회 중 오류가 발생했습니다.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "다시 조회" })).toHaveAttribute(
      "href",
      URLS.CLIENT.CONTENTS,
    );
  });

  it("페이지가 여러 개이면 페이지네이션을 렌더링한다", () => {
    const result: ActionResult<ContentListResponse> = {
      ok: true,
      data: {
        ...contentListResponse,
        meta: {
          page: 1,
          limit: 20,
          totalCount: 40,
          totalPages: 2,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      },
    };

    render(<ContentListView result={result} />);

    expect(
      screen.getByRole("navigation", { name: "콘텐츠 목록 페이지네이션" }),
    ).toBeInTheDocument();
  });
});
