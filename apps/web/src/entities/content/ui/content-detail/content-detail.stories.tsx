import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import ContentDetail from "./content-detail";

const meta = {
  title: "Entities/Content/ContentDetail",
  component: ContentDetail,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    content: {
      id: "content-id",
      title: "샘플 콘텐츠 상세 제목",
      content:
        "이 영역은 콘텐츠 본문입니다.\n\n여러 줄의 텍스트가 들어와도 줄바꿈이 유지됩니다.\n상세 페이지에서는 목록보다 더 긴 내용을 읽기 좋게 보여주는 것이 중요합니다.",
      status: "PUBLISHED",
      authorId: "author-id",
      createdAt: "2026-06-18T10:00:00.000Z",
      updatedAt: "2026-06-18T12:00:00.000Z",
    },
  },
} satisfies Meta<typeof ContentDetail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hidden: Story = {
  args: {
    content: {
      id: "hidden-content-id",
      title: "숨김 콘텐츠 상세 제목",
      content: "숨김 상태의 콘텐츠입니다.",
      status: "HIDDEN",
      authorId: "author-id",
      createdAt: "2026-06-18T10:00:00.000Z",
      updatedAt: "2026-06-18T12:00:00.000Z",
    },
  },
};

export const LongContent: Story = {
  args: {
    content: {
      id: "long-content-id",
      title: "긴 본문을 가진 콘텐츠",
      content: Array.from(
        { length: 8 },
        (_, index) =>
          `${index + 1}번째 문단입니다. 콘텐츠 상세 화면에서 긴 본문이 들어왔을 때 카드 내부 여백과 줄 간격이 자연스럽게 유지되는지 확인합니다.`,
      ).join("\n\n"),
      status: "PUBLISHED",
      authorId: "author-id",
      createdAt: "2026-06-18T10:00:00.000Z",
      updatedAt: "2026-06-18T12:00:00.000Z",
    },
  },
};
