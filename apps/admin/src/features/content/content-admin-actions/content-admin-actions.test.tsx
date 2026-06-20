import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as React from "react";
import type * as ReactModule from "react";

import type { ActionResult } from "@repo/core/action";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import ContentAdminActions from "./content-admin-actions";

const formActionMock = vi.hoisted(() => vi.fn());

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof ReactModule>("react");

  return {
    ...actual,
    default: actual,
    useActionState: vi.fn(),
  };
});

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

const mockedUseActionState = vi.mocked(React.useActionState);

const contentResponse = {
  id: "content-id",
  title: "관리자 콘텐츠",
  content: "본문입니다.",
  status: "PUBLISHED",
  authorId: "author-id",
  createdAt: "2026-06-20T00:00:00.000Z",
  updatedAt: "2026-06-20T01:00:00.000Z",
} satisfies ContentDetailResponse;

const updateStatusActionMock = vi.fn(
  async (): Promise<ActionResult<ContentDetailResponse>> => ({
    ok: true,
    data: contentResponse,
  }),
);

const deleteActionMock = vi.fn(
  async (): Promise<ActionResult<ContentDetailResponse>> => ({
    ok: true,
    data: {
      ...contentResponse,
      status: "DELETED",
    },
  }),
);

describe("ContentAdminActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    formActionMock.mockClear();
    mockedUseActionState.mockReturnValue([null, formActionMock, false] as never);
  });

  it("관리 작업 영역을 렌더링한다", () => {
    render(
      <ContentAdminActions
        content={contentResponse}
        updateStatusAction={updateStatusActionMock}
        deleteAction={deleteActionMock}
      />,
    );

    expect(screen.getByRole("heading", { name: "관리 작업" })).toBeInTheDocument();
    expect(
      screen.getByText("콘텐츠 상태를 변경하거나 삭제 상태로 전환합니다."),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "상태 변경" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "콘텐츠 삭제" })).toBeInTheDocument();
  });

  it("삭제된 콘텐츠이면 삭제 폼을 비활성화 상태로 렌더링한다", () => {
    render(
      <ContentAdminActions
        content={{
          ...contentResponse,
          status: "DELETED",
        }}
        updateStatusAction={updateStatusActionMock}
        deleteAction={deleteActionMock}
      />,
    );

    expect(screen.getByText("이미 삭제된 콘텐츠")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "콘텐츠 삭제" })).toBeDisabled();
  });
});
