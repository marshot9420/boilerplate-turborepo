import type { ContentStatus } from "@repo/domain/content/client";

const CONTENT_STATUS_LABELS = {
  PUBLISHED: "공개",
  HIDDEN: "숨김",
  DELETED: "삭제됨",
} satisfies Record<ContentStatus, string>;

export function getContentStatusLabel(status: ContentStatus) {
  return CONTENT_STATUS_LABELS[status];
}
