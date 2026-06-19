import type { ActionResult } from "@repo/core/action";
import type { ContentDetailResponse } from "@repo/domain/content/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import DeleteContentForm, {
  type DeleteContentFormAction,
  type DeleteContentFormState,
} from "./delete-content-form";

function createContentDetailResponse(
  overrides: Partial<ContentDetailResponse> = {},
): ContentDetailResponse {
  return {
    id: "content-id",
    title: "삭제된 콘텐츠",
    content: "삭제된 콘텐츠 본문입니다.",
    status: "DELETED",
    authorId: "user-id",
    createdAt: "2026-06-18T10:00:00.000Z",
    updatedAt: "2026-06-19T00:00:00.000Z",
    ...overrides,
  };
}

const mockDeleteContentAction: DeleteContentFormAction = async (
  _prevState,
  formData,
): Promise<ActionResult<ContentDetailResponse>> => {
  return {
    ok: true,
    data: createContentDetailResponse({
      id: String(formData.get("id") ?? "content-id"),
    }),
    message: "콘텐츠가 삭제되었습니다.",
  };
};

const forbiddenState: DeleteContentFormState = {
  ok: false,
  code: "CONTENT_FORBIDDEN",
  message: "콘텐츠를 삭제할 권한이 없습니다.",
};

const meta: Meta<typeof DeleteContentForm> = {
  title: "Features/Content/DeleteContentForm",
  component: DeleteContentForm,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[min(480px,calc(100vw-32px))]">
        <Story />
      </div>
    ),
  ],
  args: {
    contentId: "content-id",
    action: mockDeleteContentAction,
    confirmMessage: "",
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

export const WithConfirm = {
  args: {
    confirmMessage: "정말 이 콘텐츠를 삭제하시겠습니까?",
  },
} satisfies Story;

export const WithError = {
  args: {
    initialState: forbiddenState,
  },
} satisfies Story;
