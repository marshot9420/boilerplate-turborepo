import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import ContentDetail from "./content-detail";

const meta = {
  title: "Entities/Content/ContentDetail",
  component: ContentDetail,
  parameters: {
    layout: "padded",
  },
  args: {
    content: {
      id: "018f6f4f-7f92-7f0b-9f1d-2f4c7c0f0001",
      title: "관리자 콘텐츠 상세 제목",
      content:
        "관리자에서 콘텐츠 상세 정보를 확인하는 화면입니다.\n\n본문은 줄바꿈을 포함할 수 있으며, 상세 조회 화면에서는 원문 형태를 최대한 유지해서 표시합니다.",
      status: "PUBLISHED",
      authorId: "018f6f4f-7f92-7f0b-9f1d-2f4c7c0f0002",
      createdAt: "2026-06-20T00:00:00.000Z",
      updatedAt: "2026-06-20T01:00:00.000Z",
    },
  },
} satisfies Meta<typeof ContentDetail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Published: Story = {};

export const Hidden: Story = {
  args: {
    content: {
      id: "018f6f4f-7f92-7f0b-9f1d-2f4c7c0f0003",
      title: "숨김 콘텐츠 상세 제목",
      content: "숨김 상태의 콘텐츠입니다.",
      status: "HIDDEN",
      authorId: "018f6f4f-7f92-7f0b-9f1d-2f4c7c0f0004",
      createdAt: "2026-06-19T00:00:00.000Z",
      updatedAt: "2026-06-19T01:00:00.000Z",
    },
  },
};

export const Deleted: Story = {
  args: {
    content: {
      id: "018f6f4f-7f92-7f0b-9f1d-2f4c7c0f0005",
      title: "삭제된 콘텐츠 상세 제목",
      content: "삭제 상태의 콘텐츠입니다.",
      status: "DELETED",
      authorId: "018f6f4f-7f92-7f0b-9f1d-2f4c7c0f0006",
      createdAt: "2026-06-18T00:00:00.000Z",
      updatedAt: "2026-06-18T01:00:00.000Z",
    },
  },
};
