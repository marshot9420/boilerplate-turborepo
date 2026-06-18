import type { ContentResponse } from "@repo/domain/content/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import ContentList from "./content-list";

function createContent(overrides: Partial<ContentResponse> = {}): ContentResponse {
  return {
    id: "content-id",
    title: "샘플 콘텐츠",
    status: "PUBLISHED",
    authorId: "550e8400-e29b-41d4-a716-446655440000",
    createdAt: "2026-06-18T12:00:00.000Z",
    updatedAt: "2026-06-18T12:00:00.000Z",
    ...overrides,
  };
}

const contents = [
  createContent({
    id: "content-1",
    title: "콘텐츠 목록 조회 기능 구현하기",
  }),
  createContent({
    id: "content-2",
    title: "Server Action과 Domain Service 연결하기",
  }),
  createContent({
    id: "content-3",
    title: "디자인 시스템 컴포넌트로 카드 UI 구성하기",
  }),
  createContent({
    id: "content-4",
    title:
      "긴 제목을 가진 콘텐츠입니다. 카드 레이아웃에서 제목이 자연스럽게 줄바꿈되고 말줄임 처리되는지 확인합니다.",
  }),
  createContent({
    id: "content-5",
    title: "페이지네이션과 검색 파라미터 처리하기",
  }),
  createContent({
    id: "content-6",
    title: "콘텐츠 목록 화면 테스트 작성하기",
  }),
] satisfies ContentResponse[];

const meta = {
  title: "Entities/Content/ContentList",
  component: ContentList,
  args: {
    contents,
  },
} satisfies Meta<typeof ContentList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Empty = {
  args: {
    contents: [],
  },
} satisfies Story;

export const SingleItem = {
  args: {
    contents: [
      createContent({
        id: "single-content",
        title: "단일 콘텐츠",
      }),
    ],
  },
} satisfies Story;

export const MixedStatuses = {
  args: {
    contents: [
      createContent({
        id: "published-content",
        title: "공개 콘텐츠",
        status: "PUBLISHED",
      }),
      createContent({
        id: "hidden-content",
        title: "숨김 콘텐츠",
        status: "HIDDEN",
      }),
      createContent({
        id: "deleted-content",
        title: "삭제된 콘텐츠",
        status: "DELETED",
      }),
    ],
  },
} satisfies Story;
