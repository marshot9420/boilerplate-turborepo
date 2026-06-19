import type { ActionResult } from "@repo/core/action";
import type { ContentDetailResponse } from "@repo/domain/content/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import CreateContentForm, {
  type CreateContentFormAction,
  type CreateContentFormState,
} from "./create-content-form";

function createContentDetailResponse(
  overrides: Partial<ContentDetailResponse> = {},
): ContentDetailResponse {
  return {
    id: "content-id",
    title: "샘플 콘텐츠",
    content: "샘플 콘텐츠 본문입니다.",
    status: "PUBLISHED",
    authorId: "user-id",
    createdAt: "2026-06-19T00:00:00.000Z",
    updatedAt: "2026-06-19T00:00:00.000Z",
    ...overrides,
  };
}

const mockCreateContentAction: CreateContentFormAction = async (
  _prevState,
  formData,
): Promise<ActionResult<ContentDetailResponse>> => {
  return {
    ok: true,
    data: createContentDetailResponse({
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
    }),
    message: "콘텐츠가 생성되었습니다.",
  };
};

const validationErrorState: CreateContentFormState = {
  ok: false,
  code: "VALIDATION_ERROR",
  message: "입력값을 확인해 주세요.",
  fieldErrors: {
    title: ["제목을 입력해 주세요."],
    content: ["본문을 입력해 주세요."],
  },
};

const meta: Meta<typeof CreateContentForm> = {
  title: "Features/Content/CreateContentForm",
  component: CreateContentForm,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[min(720px,calc(100vw-32px))]">
        <Story />
      </div>
    ),
  ],
  args: {
    action: mockCreateContentAction,
  },
  argTypes: {
    action: {
      table: {
        disable: true,
      },
    },
    initialState: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const WithValidationError = {
  args: {
    initialState: validationErrorState,
  },
} satisfies Story;
