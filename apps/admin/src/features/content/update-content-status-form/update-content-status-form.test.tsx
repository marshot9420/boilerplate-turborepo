import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as React from "react";
import type * as ReactModule from "react";

import type { ActionResult } from "@repo/core/action";
import { toastActionResult } from "@repo/design-system/toast";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import UpdateContentStatusForm from "./update-content-status-form";

const routerRefreshMock = vi.hoisted(() => vi.fn());
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
    refresh: routerRefreshMock,
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
const mockedToastActionResult = vi.mocked(toastActionResult);

const contentResponse = {
  id: "content-id",
  title: "콘텐츠",
  content: "본문",
  status: "HIDDEN",
  authorId: "author-id",
  createdAt: "2026-06-20T00:00:00.000Z",
  updatedAt: "2026-06-20T01:00:00.000Z",
} satisfies ContentDetailResponse;

const actionMock = vi.fn(
  async (): Promise<ActionResult<ContentDetailResponse>> => ({
    ok: true,
    data: contentResponse,
  }),
);

function mockUseActionState(
  state: ActionResult<ContentDetailResponse> | null = null,
  pending = false,
) {
  mockedUseActionState.mockReturnValue([state, formActionMock, pending] as never);
}

describe("UpdateContentStatusForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerRefreshMock.mockClear();
    formActionMock.mockClear();
    mockUseActionState();
  });

  it("상태 변경 폼을 렌더링한다", () => {
    const { container } = render(
      <UpdateContentStatusForm
        contentId="content-id"
        currentStatus="PUBLISHED"
        action={actionMock}
      />,
    );

    expect(screen.getByRole("heading", { name: "상태 변경" })).toBeInTheDocument();
    expect(screen.getByText("콘텐츠 공개 여부를 관리자 권한으로 변경합니다.")).toBeInTheDocument();

    expect(container.querySelector('input[name="id"]')).toHaveValue("content-id");
    expect(screen.getByRole("combobox", { name: "상태" })).toHaveValue("PUBLISHED");
    expect(screen.getByRole("button", { name: "상태 변경" })).toBeEnabled();
  });

  it("삭제된 콘텐츠이면 상태 변경을 비활성화한다", () => {
    render(
      <UpdateContentStatusForm
        contentId="content-id"
        currentStatus="DELETED"
        action={actionMock}
      />,
    );

    expect(screen.getByText("상태 변경 불가")).toBeInTheDocument();
    expect(screen.getByText("삭제된 콘텐츠는 상태를 변경할 수 없습니다.")).toBeInTheDocument();

    expect(screen.getByRole("combobox", { name: "상태" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "상태 변경" })).toBeDisabled();
  });

  it("pending 상태이면 제출 버튼을 비활성화한다", () => {
    mockUseActionState(null, true);

    render(
      <UpdateContentStatusForm
        contentId="content-id"
        currentStatus="PUBLISHED"
        action={actionMock}
      />,
    );

    expect(screen.getByRole("button", { name: "변경 중..." })).toBeDisabled();
  });

  it("액션 실패 상태이면 폼 에러와 필드 에러를 렌더링한다", () => {
    mockUseActionState({
      ok: false,
      code: "VALIDATION_ERROR",
      message: "콘텐츠 상태를 확인해 주세요.",
      fieldErrors: {
        status: ["변경할 상태를 선택해 주세요."],
        id: ["콘텐츠 식별자가 올바르지 않습니다."],
      },
    });

    render(
      <UpdateContentStatusForm
        contentId="content-id"
        currentStatus="PUBLISHED"
        action={actionMock}
      />,
    );

    expect(screen.getByText("상태 변경 실패")).toBeInTheDocument();
    expect(screen.getByText("콘텐츠 상태를 확인해 주세요.")).toBeInTheDocument();
    expect(screen.getByText("변경할 상태를 선택해 주세요.")).toBeInTheDocument();
    expect(screen.getByText("콘텐츠 식별자가 올바르지 않습니다.")).toBeInTheDocument();
  });

  it("액션 성공 상태이면 toast를 표시하고 라우터를 새로고침한다", async () => {
    const state = {
      ok: true,
      data: contentResponse,
      message: "콘텐츠 상태가 변경되었습니다.",
    } satisfies ActionResult<ContentDetailResponse>;

    mockUseActionState(state);

    render(
      <UpdateContentStatusForm
        contentId="content-id"
        currentStatus="PUBLISHED"
        action={actionMock}
      />,
    );

    await waitFor(() => {
      expect(mockedToastActionResult).toHaveBeenCalledWith(state);
      expect(routerRefreshMock).toHaveBeenCalled();
    });
  });
});
