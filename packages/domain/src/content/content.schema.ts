import { z } from "zod";

import type { ListQuery } from "@repo/core/types";
import { zRequiredString } from "@repo/core/validation";

import { CONTENT } from "./content.constant";
import type { ContentStatus } from "./content.dto";

export const ContentIdParam = z.object({
  id: z.uuid(CONTENT.ID.INVALID_MESSAGE),
});

export type ContentIdParamInput = z.infer<typeof ContentIdParam>;

export const ContentStatuses = ["PUBLISHED", "HIDDEN", "DELETED"] as const;

export const ContentListSortKeys = [
  "TITLE",
  "STATUS",
  "CREATED_AT",
  "UPDATED_AT",
] as const;

export type ContentListSortKey = (typeof ContentListSortKeys)[number];

export interface ContentListQuery extends ListQuery<ContentListSortKey> {
  status?: ContentStatus;
  authorId?: string;
}

export const CreateContentRequest = z.object({
  title: zRequiredString(CONTENT.TITLE.REQUIRED_MESSAGE).max(
    CONTENT.TITLE.MAX_LENGTH,
    CONTENT.TITLE.MAX_MESSAGE,
  ),

  content: zRequiredString(CONTENT.BODY.REQUIRED_MESSAGE),

  authorId: z.uuid("작성자 식별자가 올바르지 않습니다."),
});

export type CreateContentRequestInput = z.infer<typeof CreateContentRequest>;

export const UpdateContentRequest = z.object({
  title: z
    .string()
    .trim()
    .min(CONTENT.TITLE.MIN_LENGTH, CONTENT.TITLE.MIN_MESSAGE)
    .max(CONTENT.TITLE.MAX_LENGTH, CONTENT.TITLE.MAX_MESSAGE)
    .optional(),

  content: z
    .string()
    .trim()
    .min(CONTENT.BODY.MIN_LENGTH, CONTENT.BODY.MIN_MESSAGE)
    .optional(),

  status: z.enum(ContentStatuses).optional(),
});

export type UpdateContentRequestInput = z.infer<typeof UpdateContentRequest>;
