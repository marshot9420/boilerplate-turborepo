import type { ActionResult } from "@repo/core/action";
import type { ContentDetailResponse } from "@repo/domain/content/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import UpdateContentForm, {
  type UpdateContentFormAction,
  type UpdateContentFormState,
} from "./update-content-form";

const content: ContentDetailResponse = {
  id: "content-id",
  title: "기존 콘텐츠 제목",
  content:
    "기존 콘텐츠 본문입니다.\n\n수정 폼에서는 기존 제목과 본문이 입력 필드의 기본값으로 표시됩니다.",
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
    title: "수정된 콘텐츠 제목",
    content: "수정된 콘텐츠 본문입니다.",
    updatedAt: "2026-06-19T00:00:00.000Z",
    ...overrides,
  };
}

const mockUpdateContentAction: UpdateContentFormAction = async (
  _prevState,
  formData,
): Promise<ActionResult<ContentDetailResponse>> => {
  return {
    ok: true,
    data: createContentDetailResponse({
      id: String(formData.get("id") ?? content.id),
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
    }),
    message: "콘텐츠가 수정되었습니다.",
  };
};

const validationErrorState: UpdateContentFormState = {
  ok: false,
  code: "VALIDATION_ERROR",
  message: "입력값을 확인해 주세요.",
  fieldErrors: {
    title: ["제목을 입력해 주세요."],
    content: ["본문을 입력해 주세요."],
  },
};

const meta: Meta<typeof UpdateContentForm> = {
  title: "Features/Content/UpdateContentForm",
  component: UpdateContentForm,
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
    content,
    action: mockUpdateContentAction,
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
    successHref: {
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

export const HiddenContent = {
  args: {
    content: {
      ...content,
      id: "hidden-content-id",
      title: "숨김 상태 콘텐츠",
      content: "숨김 상태 콘텐츠를 수정하는 예시입니다.",
      status: "HIDDEN",
    },
  },
} satisfies Story;

export const LongContent = {
  args: {
    content: {
      ...content,
      id: "long-content-id",
      title: "긴 본문을 가진 콘텐츠",
      content: Array.from(
        { length: 6 },
        (_, index) =>
          `${index + 1}번째 문단입니다. 수정 화면에서 긴 본문이 입력되었을 때 textarea 기본 높이와 입력 경험을 확인합니다.`,
      ).join("\n\n"),
    },
  },
} satisfies Story;
