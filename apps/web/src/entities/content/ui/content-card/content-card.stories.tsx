import type { ContentResponse } from "@repo/domain/content/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import ContentCard from "./content-card";

const sampleContent = {
  id: "content-id",
  title: "콘텐츠 목록 조회 기능 구현하기",
  status: "PUBLISHED",
  authorId: "550e8400-e29b-41d4-a716-446655440000",
  createdAt: "2026-06-18T12:00:00.000Z",
  updatedAt: "2026-06-18T12:00:00.000Z",
} satisfies ContentResponse;

const meta = {
  title: "Entities/Content/ContentCard",
  component: ContentCard,
  args: {
    content: sampleContent,
  },
} satisfies Meta<typeof ContentCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const LongTitle = {
  args: {
    content: {
      ...sampleContent,
      id: "long-title-content-id",
      title:
        "긴 제목을 가진 콘텐츠 카드입니다. 카드 내부에서 제목이 두 줄까지만 표시되고 이후 내용은 말줄임 처리되어야 합니다.",
    },
  },
} satisfies Story;

export const Hidden = {
  args: {
    content: {
      ...sampleContent,
      id: "hidden-content-id",
      title: "숨김 상태 콘텐츠",
      status: "HIDDEN",
    },
  },
} satisfies Story;

export const Deleted = {
  args: {
    content: {
      ...sampleContent,
      id: "deleted-content-id",
      title: "삭제된 콘텐츠",
      status: "DELETED",
    },
  },
} satisfies Story;
