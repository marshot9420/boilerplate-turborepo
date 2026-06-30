import type { ActionResult } from "@repo/core/action";
import type { ContentDetailResponse } from "@repo/domain/content/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import DeleteContentForm from "./delete-content-form";

const contentResponse = {
  id: "018f6f4f-7f92-7f0b-9f1d-2f4c7c0f0001",
  title: "관리자 콘텐츠",
  content: "관리자 콘텐츠 본문입니다.",
  status: "DELETED",
  authorId: "018f6f4f-7f92-7f0b-9f1d-2f4c7c0f0002",
  createdAt: "2026-06-20T00:00:00.000Z",
  updatedAt: "2026-06-20T01:00:00.000Z",
} satisfies ContentDetailResponse;

async function mockDeleteContentAction(): Promise<ActionResult<ContentDetailResponse>> {
  return {
    ok: true,
    data: contentResponse,
    message: "콘텐츠가 삭제되었습니다.",
  };
}

const meta = {
  title: "Features/Content/DeleteContentForm",
  component: DeleteContentForm,
  parameters: {
    layout: "padded",
  },
  args: {
    contentId: contentResponse.id,
    contentTitle: contentResponse.title,
    action: mockDeleteContentAction,
  },
} satisfies Meta<typeof DeleteContentForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
