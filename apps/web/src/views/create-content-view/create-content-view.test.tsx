import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CreateContentView from "./create-content-view";

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
  createContentAction: vi.fn(async () => ({
    ok: true,
    data: {
      id: "content-id",
      title: "테스트 제목",
      content: "테스트 본문",
      status: "PUBLISHED",
      authorId: "user-id",
      createdAt: "2026-06-19T00:00:00.000Z",
      updatedAt: "2026-06-19T00:00:00.000Z",
    },
    message: "콘텐츠가 생성되었습니다.",
  })),
}));

vi.mock("@repo/design-system/toast", () => ({
  toastActionResult: vi.fn(),
}));

describe("CreateContentView", () => {
  beforeEach(() => {
    routerReplaceMock.mockClear();
  });

  it("콘텐츠 작성 화면을 렌더링한다", () => {
    render(<CreateContentView />);

    expect(
      screen.getByRole("heading", {
        name: "콘텐츠 작성",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("제목과 본문을 입력해 새로운 콘텐츠를 생성합니다."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "목록으로",
      }),
    ).toHaveAttribute("href", "/contents");

    expect(
      screen.getByRole("textbox", {
        name: "제목",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", {
        name: "본문",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "콘텐츠 생성",
      }),
    ).toBeInTheDocument();
  });
});
