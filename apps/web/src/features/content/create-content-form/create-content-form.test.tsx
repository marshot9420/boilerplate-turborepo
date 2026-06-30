import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ActionResult } from "@repo/core/action";
import { toastActionResult } from "@repo/design-system/toast";
import { CONTENT, type ContentDetailResponse } from "@repo/domain/content/client";

import CreateContentForm, {
  type CreateContentFormAction,
  type CreateContentFormState,
} from "./create-content-form";

vi.mock("@repo/design-system/toast", () => ({
  toastActionResult: vi.fn(),
}));

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

function createContentDetailResponse(
  overrides: Partial<ContentDetailResponse> = {},
): ContentDetailResponse {
  return {
    id: "content-id",
    title: "테스트 제목",
    content: "테스트 본문",
    status: "PUBLISHED",
    authorId: "user-id",
    createdAt: "2026-06-19T00:00:00.000Z",
    updatedAt: "2026-06-19T00:00:00.000Z",
    ...overrides,
  };
}

function createActionMock(
  result: ActionResult<ContentDetailResponse> = {
    ok: true,
    data: createContentDetailResponse(),
    message: "콘텐츠가 생성되었습니다.",
  },
) {
  return vi.fn<CreateContentFormAction>(async () => result);
}

describe("CreateContentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("제목, 본문 입력 필드와 제출 버튼을 렌더링한다", () => {
    render(<CreateContentForm action={createActionMock()} />);

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

  it("제목과 본문 입력 길이를 표시한다", async () => {
    const user = userEvent.setup();

    render(<CreateContentForm action={createActionMock()} />);

    await user.type(
      screen.getByRole("textbox", {
        name: "제목",
      }),
      "테스트",
    );

    await user.type(
      screen.getByRole("textbox", {
        name: "본문",
      }),
      "본문입니다",
    );

    expect(screen.getByText(`3/${CONTENT.TITLE.MAX_LENGTH}`)).toBeInTheDocument();
    expect(screen.getByText("5자")).toBeInTheDocument();
  });

  it("initialState에 form error가 있으면 alert를 표시한다", () => {
    const initialState: CreateContentFormState = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
    };

    render(<CreateContentForm action={createActionMock()} initialState={initialState} />);

    expect(screen.getByRole("alert")).toHaveTextContent("입력값을 확인해 주세요.");
  });

  it("initialState에 field error가 있으면 필드 에러를 표시하고 aria-invalid를 설정한다", () => {
    const initialState: CreateContentFormState = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        title: ["제목을 입력해 주세요."],
        content: ["본문을 입력해 주세요."],
      },
    };

    render(<CreateContentForm action={createActionMock()} initialState={initialState} />);

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
    const initialState: CreateContentFormState = {
      ok: true,
      data: createContentDetailResponse(),
      message: "콘텐츠가 생성되었습니다.",
    };

    render(<CreateContentForm action={createActionMock()} initialState={initialState} />);

    await waitFor(() => {
      expect(toastActionResult).toHaveBeenCalledWith(initialState);
    });
  });

  it("초기 state가 없으면 toastActionResult를 호출하지 않는다", () => {
    render(<CreateContentForm action={createActionMock()} />);

    expect(toastActionResult).not.toHaveBeenCalled();
  });

  it("성공 state와 createdContentHrefPrefix가 있으면 생성된 콘텐츠 상세 경로로 이동한다", async () => {
    const initialState: CreateContentFormState = {
      ok: true,
      data: createContentDetailResponse({
        id: "created-content-id",
      }),
      message: "콘텐츠가 생성되었습니다.",
    };

    render(
      <CreateContentForm
        action={createActionMock()}
        initialState={initialState}
        createdContentHrefPrefix="/contents"
      />,
    );

    await waitFor(() => {
      expect(routerReplaceMock).toHaveBeenCalledWith("/contents/created-content-id");
    });
  });
});
