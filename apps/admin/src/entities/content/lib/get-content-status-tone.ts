import type { ContentStatus } from "@repo/domain/content/client";

export type ContentStatusTone = "default" | "outline" | "destructive";

const CONTENT_STATUS_TONES = {
  PUBLISHED: "default",
  HIDDEN: "outline",
  DELETED: "destructive",
} satisfies Record<ContentStatus, ContentStatusTone>;

export function getContentStatusTone(status: ContentStatus) {
  return CONTENT_STATUS_TONES[status];
}
