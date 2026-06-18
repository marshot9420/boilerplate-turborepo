import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ContentListResponse } from "@repo/domain/content/client";

import { getContentsAction } from "@/actions/content";

import ContentListView from "./content-list-view";

vi.mock("@/actions/content", () => ({
  getContentsAction: vi.fn(),
}));

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
  const mockedGetContentsAction = vi.mocked(getContentsAction);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("콘텐츠 목록 조회 액션을 호출한다", async () => {
    mockedGetContentsAction.mockResolvedValue({
      ok: true,
      data: contentListResponse,
    });

    const jsx = await ContentListView({
      page: 2,
      limit: 10,
    });

    render(jsx);

    expect(mockedGetContentsAction).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
    });
  });

  it("콘텐츠 목록 조회 성공 상태를 렌더링한다", async () => {
    mockedGetContentsAction.mockResolvedValue({
      ok: true,
      data: contentListResponse,
    });

    const jsx = await ContentListView({
      page: 1,
      limit: 20,
    });

    render(jsx);

    expect(screen.getByRole("heading", { name: "콘텐츠" })).toBeInTheDocument();
    expect(screen.getByText("공개된 콘텐츠 목록을 확인할 수 있습니다.")).toBeInTheDocument();
    expect(screen.getByText("총 1개")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "샘플 콘텐츠" })).toBeInTheDocument();
  });

  it("콘텐츠가 없으면 빈 상태를 렌더링한다", async () => {
    mockedGetContentsAction.mockResolvedValue({
      ok: true,
      data: {
        ...contentListResponse,
        items: [],
        meta: {
          ...contentListResponse.meta,
          totalCount: 0,
        },
      },
    });

    const jsx = await ContentListView({});

    render(jsx);

    expect(
      screen.getByRole("heading", {
        name: "등록된 콘텐츠가 없습니다.",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("총 0개")).toBeInTheDocument();
  });

  it("콘텐츠 목록 조회 실패 상태를 렌더링한다", async () => {
    mockedGetContentsAction.mockResolvedValue({
      ok: false,
      code: "DATABASE_UNKNOWN_ERROR",
      message: "콘텐츠 목록을 불러오지 못했습니다.",
    });

    const jsx = await ContentListView({});

    render(jsx);

    expect(screen.getByRole("heading", { name: "콘텐츠" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("콘텐츠 목록을 불러오지 못했습니다.");
  });
});
