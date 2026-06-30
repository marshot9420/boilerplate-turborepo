import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ActionResult } from "@repo/core/action";
import { toastActionResult } from "@repo/design-system/toast";
import { CONTENT, type ContentDetailResponse } from "@repo/domain/content/client";

import UpdateContentForm, {
  type UpdateContentFormAction,
  type UpdateContentFormState,
} from "./update-content-form";

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

const content: ContentDetailResponse = {
  id: "content-id",
  title: "기존 제목",
  content: "기존 본문입니다.",
  status: "PUBLISHED",
  authorId: "user-id",
  createdAt: "2026-06-18T10:00:00.000Z",
  updatedAt: "2026-06-18T12:00:00.000Z",
};

function createContentDetailResponse(
  overrides: Partial<ContentDetailResponse> = {},
): ContentDetailResponse {
  return {
    ...content,
    title: "수정된 제목",
    content: "수정된 본문입니다.",
    updatedAt: "2026-06-19T00:00:00.000Z",
    ...overrides,
  };
}

function createActionMock(
  result: ActionResult<ContentDetailResponse> = {
    ok: true,
    data: createContentDetailResponse(),
    message: "콘텐츠가 수정되었습니다.",
  },
) {
  return vi.fn<UpdateContentFormAction>(async () => result);
}

describe("UpdateContentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("기존 콘텐츠 값과 제출 버튼을 렌더링한다", () => {
    render(<UpdateContentForm content={content} action={createActionMock()} />);

    expect(
      screen.getByRole("textbox", {
        name: "제목",
      }),
    ).toHaveValue("기존 제목");

    expect(
      screen.getByRole("textbox", {
        name: "본문",
      }),
    ).toHaveValue("기존 본문입니다.");

    expect(
      screen.getByText(`${content.title.length}/${CONTENT.TITLE.MAX_LENGTH}`),
    ).toBeInTheDocument();
    expect(screen.getByText(`${content.content.length}자`)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "콘텐츠 수정",
      }),
    ).toBeInTheDocument();

    const hiddenIdInput = document.querySelector<HTMLInputElement>('input[name="id"]');

    expect(hiddenIdInput).toHaveValue("content-id");
  });

  it("제목과 본문 입력 길이를 변경된 값 기준으로 표시한다", async () => {
    const user = userEvent.setup();

    render(<UpdateContentForm content={content} action={createActionMock()} />);

    const titleInput = screen.getByRole("textbox", {
      name: "제목",
    });

    const contentTextarea = screen.getByRole("textbox", {
      name: "본문",
    });

    await user.clear(titleInput);
    await user.type(titleInput, "abc");

    await user.clear(contentTextarea);
    await user.type(contentTextarea, "abcdef");

    expect(screen.getByText(`3/${CONTENT.TITLE.MAX_LENGTH}`)).toBeInTheDocument();
    expect(screen.getByText("6자")).toBeInTheDocument();
  });

  it("initialState에 form error가 있으면 alert를 표시한다", () => {
    const initialState: UpdateContentFormState = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
    };

    render(
      <UpdateContentForm
        content={content}
        action={createActionMock()}
        initialState={initialState}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("입력값을 확인해 주세요.");
  });

  it("initialState에 field error가 있으면 필드 에러를 표시하고 aria-invalid를 설정한다", () => {
    const initialState: UpdateContentFormState = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        title: ["제목을 입력해 주세요."],
        content: ["본문을 입력해 주세요."],
      },
    };

    render(
      <UpdateContentForm
        content={content}
        action={createActionMock()}
        initialState={initialState}
      />,
    );

    const titleInput = screen.getByRole("textbox", {
      name: "제목",
    });

    const contentTextarea = screen.getByRole("textbox", {
      name: "본문",
    });

    expect(screen.getByText("제목을 입력해 주세요.")).toBeInTheDocument();
    expect(screen.getByText("본문을 입력해 주세요.")).toBeInTheDocument();

    expect(titleInput).toHaveAttribute("aria-invalid", "true");
    expect(contentTextarea).toHaveAttribute("aria-invalid", "true");
  });

  it("state가 있으면 toastActionResult를 호출한다", async () => {
    const initialState: UpdateContentFormState = {
      ok: true,
      data: createContentDetailResponse(),
      message: "콘텐츠가 수정되었습니다.",
    };

    render(
      <UpdateContentForm
        content={content}
        action={createActionMock()}
        initialState={initialState}
      />,
    );

    await waitFor(() => {
      expect(toastActionResult).toHaveBeenCalledWith(initialState);
    });
  });

  it("초기 state가 없으면 toastActionResult를 호출하지 않는다", () => {
    render(<UpdateContentForm content={content} action={createActionMock()} />);

    expect(toastActionResult).not.toHaveBeenCalled();
  });

  it("성공 state와 successHref가 있으면 해당 경로로 이동한다", async () => {
    const initialState: UpdateContentFormState = {
      ok: true,
      data: createContentDetailResponse({
        id: "content-id",
      }),
      message: "콘텐츠가 수정되었습니다.",
    };

    render(
      <UpdateContentForm
        content={content}
        action={createActionMock()}
        initialState={initialState}
        successHref="/contents/content-id"
      />,
    );

    await waitFor(() => {
      expect(routerReplaceMock).toHaveBeenCalledWith("/contents/content-id");
    });
  });

  it("성공 state여도 successHref가 없으면 페이지 이동을 하지 않는다", async () => {
    const initialState: UpdateContentFormState = {
      ok: true,
      data: createContentDetailResponse(),
      message: "콘텐츠가 수정되었습니다.",
    };

    render(
      <UpdateContentForm
        content={content}
        action={createActionMock()}
        initialState={initialState}
      />,
    );

    await waitFor(() => {
      expect(toastActionResult).toHaveBeenCalledWith(initialState);
    });

    expect(routerReplaceMock).not.toHaveBeenCalled();
  });
});
