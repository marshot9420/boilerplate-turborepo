import { notFound } from "next/navigation";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getContentByIdAction } from "@/actions/content";

import ContentDetailView from "./content-detail-view";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/actions/content", () => ({
  getContentByIdAction: vi.fn(),
}));

const mockedGetContentByIdAction = vi.mocked(getContentByIdAction);
const mockedNotFound = vi.mocked(notFound);

describe("ContentDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("콘텐츠 상세 조회에 성공하면 상세 UI를 렌더링한다", async () => {
    mockedGetContentByIdAction.mockResolvedValue({
      ok: true,
      data: {
        id: "content-id",
        title: "콘텐츠 상세 제목",
        content: "콘텐츠 상세 본문입니다.",
        status: "PUBLISHED",
        authorId: "author-id",
        createdAt: "2026-06-18T10:00:00.000Z",
        updatedAt: "2026-06-18T12:00:00.000Z",
      },
    });

    render(await ContentDetailView({ contentId: "content-id" }));

    expect(mockedGetContentByIdAction).toHaveBeenCalledWith("content-id");

    expect(
      screen.getByRole("heading", {
        name: "콘텐츠 상세 제목",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("콘텐츠 상세 본문입니다.")).toBeInTheDocument();
  });

  it("콘텐츠를 찾을 수 없으면 notFound를 호출한다", async () => {
    mockedGetContentByIdAction.mockResolvedValue({
      ok: false,
      code: "CONTENT_NOT_FOUND",
      message: "콘텐츠를 찾을 수 없습니다.",
    });

    await expect(ContentDetailView({ contentId: "missing-content-id" })).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );

    expect(mockedNotFound).toHaveBeenCalled();
  });

  it("조회 권한이 없으면 notFound를 호출한다", async () => {
    mockedGetContentByIdAction.mockResolvedValue({
      ok: false,
      code: "CONTENT_FORBIDDEN",
      message: "콘텐츠를 조회할 권한이 없습니다.",
    });

    await expect(ContentDetailView({ contentId: "hidden-content-id" })).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );

    expect(mockedNotFound).toHaveBeenCalled();
  });

  it("일반 오류가 발생하면 에러 UI를 렌더링한다", async () => {
    mockedGetContentByIdAction.mockResolvedValue({
      ok: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "콘텐츠를 불러오는 중 오류가 발생했습니다.",
    });

    render(await ContentDetailView({ contentId: "content-id" }));

    expect(
      screen.getByRole("heading", {
        name: "콘텐츠를 불러오지 못했습니다.",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("콘텐츠를 불러오는 중 오류가 발생했습니다.")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "목록으로 돌아가기",
      }),
    ).toHaveAttribute("href", "/contents");
  });
});
