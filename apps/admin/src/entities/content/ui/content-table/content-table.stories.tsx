import type { ContentResponse } from "@repo/domain/content/client";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import ContentTable from "./content-table";

const contents: ContentResponse[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    title: "공개 콘텐츠",
    status: "PUBLISHED",
    authorId: "00000000-0000-4000-8000-100000000001",
    createdAt: "2026-06-20T00:00:00.000Z",
    updatedAt: "2026-06-20T01:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    title: "숨김 콘텐츠",
    status: "HIDDEN",
    authorId: "00000000-0000-4000-8000-100000000002",
    createdAt: "2026-06-21T00:00:00.000Z",
    updatedAt: "2026-06-21T01:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    title: "삭제된 콘텐츠",
    status: "DELETED",
    authorId: "00000000-0000-4000-8000-100000000003",
    createdAt: "2026-06-22T00:00:00.000Z",
    updatedAt: "2026-06-22T01:00:00.000Z",
  },
];

const meta = {
  title: "Entities/Content/ContentTable",
  component: ContentTable,
  parameters: {
    layout: "padded",
  },
  args: {
    contents,
  },
} satisfies Meta<typeof ContentTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleItem: Story = {
  args: {
    contents: [contents[0]!],
  },
};
