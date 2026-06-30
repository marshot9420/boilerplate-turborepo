import { useRouter } from "next/navigation";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { toastActionResult } from "@repo/design-system/toast";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import CreateContentForm, {
  type CreateContentFormAction,
  type CreateContentFormState,
} from "./create-content-form";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@repo/design-system/toast", () => ({
  toastActionResult: vi.fn(),
}));

const replace = vi.fn();

const createdContent = {
  id: "content-id",
  title: "생성된 콘텐츠 제목",
  content: "생성된 콘텐츠 본문",
  status: "PUBLISHED",
  authorId: "user-id",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
} satisfies ContentDetailResponse;

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(useRouter).mockReturnValue({
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
    replace,
  } as ReturnType<typeof useRouter>);
});

describe("CreateContentForm integration", () => {
  it("제목과 본문을 입력한 뒤 제출하면 action을 호출하고 성공 시 toast와 페이지 이동을 수행한다", async () => {
    const user = userEvent.setup();

    const successResult = {
      ok: true,
      data: createdContent,
      message: "콘텐츠가 생성되었습니다.",
    } satisfies Exclude<CreateContentFormState, null>;

    const action = vi.fn<CreateContentFormAction>(async (_prevState, formData) => {
      expect(formData.get("title")).toBe("새 콘텐츠 제목");
      expect(formData.get("content")).toBe("새 콘텐츠 본문");

      return successResult;
    });

    render(<CreateContentForm action={action} createdContentHrefPrefix="/contents" />);

    await user.type(screen.getByLabelText("제목"), "새 콘텐츠 제목");
    await user.type(screen.getByLabelText("본문"), "새 콘텐츠 본문");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(toastActionResult).toHaveBeenCalledWith(successResult);
    });

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/contents/content-id");
    });

    expect(screen.getByLabelText("제목")).toHaveValue("");
    expect(screen.getByLabelText("본문")).toHaveValue("");
  });

  it("initialState에 필드 에러가 있으면 폼 에러와 필드 에러를 표시한다", () => {
    const failureResult = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        title: ["제목을 입력해 주세요."],
        content: ["본문을 입력해 주세요."],
      },
    } satisfies Exclude<CreateContentFormState, null>;

    const action = vi.fn<CreateContentFormAction>();

    render(<CreateContentForm action={action} initialState={failureResult} />);

    expect(screen.getByText("입력값을 확인해 주세요.")).toBeInTheDocument();
    expect(screen.getByText("제목을 입력해 주세요.")).toBeInTheDocument();
    expect(screen.getByText("본문을 입력해 주세요.")).toBeInTheDocument();

    expect(screen.getByLabelText("제목")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("본문")).toHaveAttribute("aria-invalid", "true");

    expect(screen.getAllByRole("alert")).toHaveLength(3);
  });

  it("successHref가 있으면 생성된 콘텐츠 상세 경로보다 successHref를 우선한다", async () => {
    const user = userEvent.setup();

    const successResult = {
      ok: true,
      data: createdContent,
      message: "콘텐츠가 생성되었습니다.",
    } satisfies Exclude<CreateContentFormState, null>;

    const action = vi.fn<CreateContentFormAction>(async () => successResult);

    render(
      <CreateContentForm
        action={action}
        successHref="/my-page"
        createdContentHrefPrefix="/contents"
      />,
    );

    await user.type(screen.getByLabelText("제목"), "새 콘텐츠 제목");
    await user.type(screen.getByLabelText("본문"), "새 콘텐츠 본문");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/my-page");
    });
  });
});
