import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ContentDetailResponse } from "@repo/domain/content/client";

import UpdateContentView from "./update-content-view";

const routerReplaceMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: routerReplaceMock,
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@repo/design-system/toast", () => ({
  toastActionResult: vi.fn(),
}));

vi.mock("@/actions/content", () => ({
  updateMyContentAction: vi.fn(async () => ({
    ok: true,
    data: {
      id: "content-id",
      title: "수정된 제목",
      content: "수정된 본문",
      status: "PUBLISHED",
      authorId: "user-id",
      createdAt: "2026-06-18T10:00:00.000Z",
      updatedAt: "2026-06-19T00:00:00.000Z",
    },
    message: "콘텐츠가 수정되었습니다.",
  })),
}));

const content: ContentDetailResponse = {
  id: "content-id",
  title: "기존 콘텐츠 제목",
  content: "기존 콘텐츠 본문입니다.",
  status: "PUBLISHED",
  authorId: "user-id",
  createdAt: "2026-06-18T10:00:00.000Z",
  updatedAt: "2026-06-18T12:00:00.000Z",
};

describe("UpdateContentView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("콘텐츠가 있으면 수정 화면을 렌더링한다", () => {
    render(<UpdateContentView content={content} />);

    expect(
      screen.getByRole("heading", {
        name: "콘텐츠 수정",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("작성한 콘텐츠의 제목과 본문을 수정합니다.")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "상세로",
      }),
    ).toHaveAttribute("href", "/contents/content-id");

    expect(
      screen.getByRole("textbox", {
        name: "제목",
      }),
    ).toHaveValue("기존 콘텐츠 제목");

    expect(
      screen.getByRole("textbox", {
        name: "본문",
      }),
    ).toHaveValue("기존 콘텐츠 본문입니다.");

    expect(
      screen.getByRole("button", {
        name: "콘텐츠 수정",
      }),
    ).toBeInTheDocument();
  });

  it("콘텐츠가 없으면 에러 화면을 렌더링한다", () => {
    render(<UpdateContentView errorMessage="콘텐츠를 수정할 권한이 없습니다." />);

    expect(screen.getByText("콘텐츠를 불러올 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByText("콘텐츠를 수정할 권한이 없습니다.")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "목록으로",
      }),
    ).toHaveAttribute("href", "/contents");

    expect(
      screen.queryByRole("heading", {
        name: "콘텐츠 수정",
      }),
    ).not.toBeInTheDocument();
  });

  it("콘텐츠가 없고 에러 메시지도 없으면 기본 에러 메시지를 렌더링한다", () => {
    render(<UpdateContentView />);

    expect(screen.getByText("콘텐츠를 불러올 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByText("콘텐츠를 불러오는 중 오류가 발생했습니다.")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "목록으로",
      }),
    ).toHaveAttribute("href", "/contents");
  });
});
