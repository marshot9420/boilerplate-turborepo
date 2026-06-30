import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ContentListResponse } from "@repo/domain/content/client";

import ContentListView from "./content-list-view";

const contentListResponse = {
  items: [
    {
      id: "content-id",
      title: "샘플 콘텐츠",
      status: "PUBLISHED",
      authorId: "author-id",
      createdAt: "2026-06-18T12:00:00.000Z",
      updatedAt: "2026-06-18T12:00:00.000Z",
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
} satisfies ContentListResponse;

describe("ContentListView", () => {
  it("콘텐츠 목록 조회 성공 상태를 렌더링한다", () => {
    render(<ContentListView data={contentListResponse} />);

    expect(screen.getByRole("heading", { name: "콘텐츠" })).toBeInTheDocument();
    expect(screen.getByText("공개된 콘텐츠 목록을 확인할 수 있습니다.")).toBeInTheDocument();
    expect(screen.getByText("총 1개")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "샘플 콘텐츠" })).toBeInTheDocument();
  });

  it("콘텐츠가 없으면 빈 상태를 렌더링한다", () => {
    render(
      <ContentListView
        data={{
          ...contentListResponse,
          items: [],
          meta: {
            ...contentListResponse.meta,
            totalCount: 0,
          },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "등록된 콘텐츠가 없습니다.",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("총 0개")).toBeInTheDocument();
  });

  it("콘텐츠 목록 조회 실패 상태를 렌더링한다", () => {
    render(<ContentListView errorMessage="콘텐츠 목록을 불러오지 못했습니다." />);

    expect(screen.getByRole("heading", { name: "콘텐츠" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("콘텐츠 목록을 불러오지 못했습니다.");
  });

  it("콘텐츠 목록 조회 실패 메시지가 없으면 기본 메시지를 렌더링한다", () => {
    render(<ContentListView />);

    expect(screen.getByRole("heading", { name: "콘텐츠" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "콘텐츠 목록을 불러오는 중 오류가 발생했습니다.",
    );
  });
});
