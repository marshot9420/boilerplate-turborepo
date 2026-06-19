import { notFound } from "next/navigation";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getCurrentSession } from "@repo/auth/server";
import { canUpdateContent } from "@repo/domain/content/server";

import { getContentByIdAction } from "@/actions/content";

import ContentDetailView from "./content-detail-view";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@repo/auth/server", () => ({
  getCurrentSession: vi.fn(),
}));

vi.mock("@repo/domain/content/server", () => ({
  canUpdateContent: vi.fn(),
}));

vi.mock("@/actions/content", () => ({
  getContentByIdAction: vi.fn(),
}));

const mockedGetContentByIdAction = vi.mocked(getContentByIdAction);
const mockedGetCurrentSession = vi.mocked(getCurrentSession);
const mockedCanUpdateContent = vi.mocked(canUpdateContent);
const mockedNotFound = vi.mocked(notFound);

const contentResponse = {
  id: "content-id",
  title: "콘텐츠 상세 제목",
  content: "콘텐츠 상세 본문입니다.",
  status: "PUBLISHED" as const,
  authorId: "author-id",
  createdAt: "2026-06-18T10:00:00.000Z",
  updatedAt: "2026-06-18T12:00:00.000Z",
};

function createSession() {
  return {
    id: "session-id",
    expiresAt: new Date("2026-12-31T00:00:00.000Z"),
    revokedAt: null,
    user: {
      id: "author-id",
      email: "author@example.com",
      name: "작성자",
      avatarUrl: null,
      nickname: "author",
      role: "USER" as const,
      status: "ACTIVE" as const,
    },
  };
}

describe("ContentDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetCurrentSession.mockResolvedValue(null);
    mockedCanUpdateContent.mockReturnValue(false);
  });

  it("콘텐츠 상세 조회에 성공하면 상세 UI를 렌더링한다", async () => {
    mockedGetContentByIdAction.mockResolvedValue({
      ok: true,
      data: contentResponse,
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

  it("비로그인 상태이면 수정 링크를 렌더링하지 않는다", async () => {
    mockedGetCurrentSession.mockResolvedValue(null);

    mockedGetContentByIdAction.mockResolvedValue({
      ok: true,
      data: contentResponse,
    });

    render(await ContentDetailView({ contentId: "content-id" }));

    expect(mockedCanUpdateContent).not.toHaveBeenCalled();

    expect(
      screen.queryByRole("link", {
        name: "수정",
      }),
    ).not.toBeInTheDocument();
  });

  it("수정 권한이 있으면 수정 링크를 렌더링한다", async () => {
    mockedGetCurrentSession.mockResolvedValue(createSession());
    mockedCanUpdateContent.mockReturnValue(true);

    mockedGetContentByIdAction.mockResolvedValue({
      ok: true,
      data: contentResponse,
    });

    render(await ContentDetailView({ contentId: "content-id" }));

    expect(mockedCanUpdateContent).toHaveBeenCalledWith(
      {
        id: "author-id",
        role: "USER",
        status: "ACTIVE",
      },
      contentResponse,
    );

    expect(
      screen.getByRole("link", {
        name: "수정",
      }),
    ).toHaveAttribute("href", "/contents/content-id/edit");
  });

  it("로그인 상태여도 수정 권한이 없으면 수정 링크를 렌더링하지 않는다", async () => {
    mockedGetCurrentSession.mockResolvedValue(createSession());
    mockedCanUpdateContent.mockReturnValue(false);

    mockedGetContentByIdAction.mockResolvedValue({
      ok: true,
      data: contentResponse,
    });

    render(await ContentDetailView({ contentId: "content-id" }));

    expect(
      screen.queryByRole("link", {
        name: "수정",
      }),
    ).not.toBeInTheDocument();
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
