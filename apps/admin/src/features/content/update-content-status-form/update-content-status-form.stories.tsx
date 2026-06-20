import type { ActionResult } from "@repo/core/action";
import type { ContentDetailResponse } from "@repo/domain/content/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import UpdateContentStatusForm from "./update-content-status-form";

const contentResponse = {
  id: "018f6f4f-7f92-7f0b-9f1d-2f4c7c0f0001",
  title: "관리자 콘텐츠",
  content: "관리자 콘텐츠 본문입니다.",
  status: "PUBLISHED",
  authorId: "018f6f4f-7f92-7f0b-9f1d-2f4c7c0f0002",
  createdAt: "2026-06-20T00:00:00.000Z",
  updatedAt: "2026-06-20T01:00:00.000Z",
} satisfies ContentDetailResponse;

async function mockUpdateContentStatusAction(): Promise<ActionResult<ContentDetailResponse>> {
  return {
    ok: true,
    data: contentResponse,
    message: "콘텐츠 상태가 변경되었습니다.",
  };
}

const meta = {
  title: "Features/Content/UpdateContentStatusForm",
  component: UpdateContentStatusForm,
  parameters: {
    layout: "padded",
  },
  args: {
    contentId: contentResponse.id,
    currentStatus: "PUBLISHED",
    action: mockUpdateContentStatusAction,
  },
} satisfies Meta<typeof UpdateContentStatusForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Published: Story = {};

export const Hidden: Story = {
  args: {
    currentStatus: "HIDDEN",
  },
};

export const Deleted: Story = {
  args: {
    currentStatus: "DELETED",
  },
};
