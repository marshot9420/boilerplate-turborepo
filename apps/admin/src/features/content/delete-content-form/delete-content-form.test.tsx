import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as React from "react";
import type * as ReactModule from "react";

import type { ActionResult } from "@repo/core/action";
import { toastActionResult } from "@repo/design-system/toast";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";

import DeleteContentForm from "./delete-content-form";

const routerRefreshMock = vi.hoisted(() => vi.fn());
const routerReplaceMock = vi.hoisted(() => vi.fn());
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
    replace: routerReplaceMock,
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

const deletedContentResponse = {
  id: "content-id",
  title: "삭제된 콘텐츠",
  content: "본문",
  status: "DELETED",
  authorId: "author-id",
  createdAt: "2026-06-20T00:00:00.000Z",
  updatedAt: "2026-06-20T01:00:00.000Z",
} satisfies ContentDetailResponse;

const actionMock = vi.fn(
  async (): Promise<ActionResult<ContentDetailResponse>> => ({
    ok: true,
    data: deletedContentResponse,
  }),
);

function mockUseActionState(
  state: ActionResult<ContentDetailResponse> | null = null,
  pending = false,
) {
  mockedUseActionState.mockReturnValue([state, formActionMock, pending] as never);
}

describe("DeleteContentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerRefreshMock.mockClear();
    routerReplaceMock.mockClear();
    formActionMock.mockClear();
    mockUseActionState();
  });

  it("삭제 폼을 렌더링한다", () => {
    render(
      <DeleteContentForm contentId="content-id" contentTitle="삭제할 콘텐츠" action={actionMock} />,
    );

    expect(screen.getByRole("heading", { name: "콘텐츠 삭제" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "콘텐츠를 삭제 상태로 변경합니다. 삭제된 콘텐츠는 일반 사용자에게 노출되지 않습니다.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "콘텐츠 삭제" })).toBeEnabled();
  });

  it("삭제 버튼을 누르면 확인 다이얼로그를 렌더링한다", async () => {
    const user = userEvent.setup();

    render(
      <DeleteContentForm contentId="content-id" contentTitle="삭제할 콘텐츠" action={actionMock} />,
    );

    await user.click(screen.getByRole("button", { name: "콘텐츠 삭제" }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "콘텐츠를 삭제할까요?" })).toBeInTheDocument();
    expect(
      screen.getByText(/「삭제할 콘텐츠」 콘텐츠를 삭제 상태로 변경합니다./),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
  });

  it("disabled 상태이면 삭제 버튼을 비활성화하고 안내를 렌더링한다", () => {
    render(
      <DeleteContentForm
        contentId="content-id"
        contentTitle="삭제할 콘텐츠"
        disabled
        action={actionMock}
      />,
    );

    expect(screen.getByText("이미 삭제된 콘텐츠")).toBeInTheDocument();
    expect(screen.getByText("이미 삭제된 콘텐츠는 다시 삭제할 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "콘텐츠 삭제" })).toBeDisabled();
  });

  it("pending 상태이면 삭제 버튼을 비활성화한다", () => {
    mockUseActionState(null, true);

    render(
      <DeleteContentForm contentId="content-id" contentTitle="삭제할 콘텐츠" action={actionMock} />,
    );

    expect(screen.getByRole("button", { name: "콘텐츠 삭제" })).toBeDisabled();
  });

  it("액션 실패 상태이면 폼 에러와 필드 에러를 렌더링한다", () => {
    mockUseActionState({
      ok: false,
      code: "VALIDATION_ERROR",
      message: "콘텐츠 삭제에 실패했습니다.",
      fieldErrors: {
        id: ["콘텐츠 식별자가 올바르지 않습니다."],
      },
    });

    render(
      <DeleteContentForm contentId="content-id" contentTitle="삭제할 콘텐츠" action={actionMock} />,
    );

    expect(screen.getByText("삭제 실패")).toBeInTheDocument();
    expect(screen.getByText("콘텐츠 삭제에 실패했습니다.")).toBeInTheDocument();
    expect(screen.getByText("콘텐츠 식별자가 올바르지 않습니다.")).toBeInTheDocument();
  });

  it("액션 성공 상태이면 toast를 표시하고 목록으로 이동한다", async () => {
    const state = {
      ok: true,
      data: deletedContentResponse,
      message: "콘텐츠가 삭제되었습니다.",
    } satisfies ActionResult<ContentDetailResponse>;

    mockUseActionState(state);

    render(
      <DeleteContentForm contentId="content-id" contentTitle="삭제된 콘텐츠" action={actionMock} />,
    );

    await waitFor(() => {
      expect(mockedToastActionResult).toHaveBeenCalledWith(state);
      expect(routerReplaceMock).toHaveBeenCalledWith(URLS.CLIENT.CONTENTS);
      expect(routerRefreshMock).toHaveBeenCalled();
    });
  });
});
