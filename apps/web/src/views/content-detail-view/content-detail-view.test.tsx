import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ContentDetailView from "./content-detail-view";

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

vi.mock("@/actions/content", () => ({
  deleteMyContentAction: vi.fn(),
}));

vi.mock("@repo/design-system/toast", () => ({
  toastActionResult: vi.fn(),
}));

const contentResponse = {
  id: "content-id",
  title: "콘텐츠 상세 제목",
  content: "콘텐츠 상세 본문입니다.",
  status: "PUBLISHED" as const,
  authorId: "author-id",
  createdAt: "2026-06-18T10:00:00.000Z",
  updatedAt: "2026-06-18T12:00:00.000Z",
};

describe("ContentDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerReplaceMock.mockClear();
  });

  it("콘텐츠 상세 정보를 렌더링한다", () => {
    render(<ContentDetailView content={contentResponse} />);

    expect(
      screen.getByRole("heading", {
        name: "콘텐츠 상세 제목",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("콘텐츠 상세 본문입니다.")).toBeInTheDocument();
  });

  it("수정 권한이 없으면 수정 링크를 렌더링하지 않는다", () => {
    render(<ContentDetailView content={contentResponse} canEdit={false} />);

    expect(
      screen.queryByRole("link", {
        name: "수정",
      }),
    ).not.toBeInTheDocument();
  });

  it("수정 권한이 있으면 수정 링크를 렌더링한다", () => {
    render(<ContentDetailView content={contentResponse} canEdit />);

    expect(
      screen.getByRole("link", {
        name: "수정",
      }),
    ).toHaveAttribute("href", "/contents/content-id/edit");
  });

  it("일반 오류가 발생하면 에러 UI를 렌더링한다", () => {
    render(<ContentDetailView errorMessage="콘텐츠를 불러오는 중 오류가 발생했습니다." />);

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

  it("에러 메시지가 없으면 기본 에러 메시지를 렌더링한다", () => {
    render(<ContentDetailView />);

    expect(
      screen.getByRole("heading", {
        name: "콘텐츠를 불러오지 못했습니다.",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("콘텐츠를 불러오는 중 오류가 발생했습니다.")).toBeInTheDocument();
  });

  it("삭제 권한이 있으면 삭제 버튼을 렌더링한다", () => {
    render(<ContentDetailView content={contentResponse} canDelete />);

    expect(
      screen.getByRole("button", {
        name: "콘텐츠 삭제",
      }),
    ).toBeInTheDocument();
  });

  it("삭제 권한이 없으면 삭제 버튼을 렌더링하지 않는다", () => {
    render(<ContentDetailView content={contentResponse} canDelete={false} />);

    expect(
      screen.queryByRole("button", {
        name: "콘텐츠 삭제",
      }),
    ).not.toBeInTheDocument();
  });
});
