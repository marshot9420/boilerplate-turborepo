import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ActionResult } from "@repo/core/action";
import { toastActionResult } from "@repo/design-system/toast";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import DeleteContentForm, {
  type DeleteContentFormAction,
  type DeleteContentFormState,
} from "./delete-content-form";

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

function createContentDetailResponse(
  overrides: Partial<ContentDetailResponse> = {},
): ContentDetailResponse {
  return {
    id: "content-id",
    title: "테스트 제목",
    content: "테스트 본문",
    status: "DELETED",
    authorId: "user-id",
    createdAt: "2026-06-18T10:00:00.000Z",
    updatedAt: "2026-06-19T00:00:00.000Z",
    ...overrides,
  };
}

function createActionMock(
  result: ActionResult<ContentDetailResponse> = {
    ok: true,
    data: createContentDetailResponse(),
    message: "콘텐츠가 삭제되었습니다.",
  },
) {
  return vi.fn<DeleteContentFormAction>(async () => result);
}

describe("DeleteContentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("삭제 버튼과 content id hidden input을 렌더링한다", () => {
    render(<DeleteContentForm contentId="content-id" action={createActionMock()} />);

    expect(
      screen.getByRole("button", {
        name: "콘텐츠 삭제",
      }),
    ).toBeInTheDocument();

    const hiddenIdInput = document.querySelector<HTMLInputElement>('input[name="id"]');

    expect(hiddenIdInput).toHaveValue("content-id");
  });

  it("initialState에 form error가 있으면 alert를 표시한다", () => {
    const initialState: DeleteContentFormState = {
      ok: false,
      code: "CONTENT_FORBIDDEN",
      message: "콘텐츠를 삭제할 권한이 없습니다.",
    };

    render(
      <DeleteContentForm
        contentId="content-id"
        action={createActionMock()}
        initialState={initialState}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("콘텐츠를 삭제할 권한이 없습니다.");
  });

  it("state가 있으면 toastActionResult를 호출한다", async () => {
    const initialState: DeleteContentFormState = {
      ok: true,
      data: createContentDetailResponse(),
      message: "콘텐츠가 삭제되었습니다.",
    };

    render(
      <DeleteContentForm
        contentId="content-id"
        action={createActionMock()}
        initialState={initialState}
      />,
    );

    await waitFor(() => {
      expect(toastActionResult).toHaveBeenCalledWith(initialState);
    });
  });

  it("성공 state와 successHref가 있으면 해당 경로로 이동한다", async () => {
    const initialState: DeleteContentFormState = {
      ok: true,
      data: createContentDetailResponse(),
      message: "콘텐츠가 삭제되었습니다.",
    };

    render(
      <DeleteContentForm
        contentId="content-id"
        action={createActionMock()}
        initialState={initialState}
        successHref="/contents"
      />,
    );

    await waitFor(() => {
      expect(routerReplaceMock).toHaveBeenCalledWith("/contents");
    });
  });

  it("confirm에서 취소하면 submit 기본 동작을 막는다", () => {
    const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<DeleteContentForm contentId="content-id" action={createActionMock()} />);

    const form = screen
      .getByRole("button", {
        name: "콘텐츠 삭제",
      })
      .closest("form");

    if (!form) {
      throw new Error("Expected delete form.");
    }

    const submitEvent = fireEvent.submit(form);

    expect(confirmMock).toHaveBeenCalledWith("정말 이 콘텐츠를 삭제하시겠습니까?");
    expect(submitEvent).toBe(false);
  });
});
