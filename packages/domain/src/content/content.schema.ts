import { z } from "zod";

import {
  zOptionalEnum,
  zOptionalInt,
  zOptionalString,
  zRequiredString,
} from "@repo/core/validation";

import { CONTENT } from "./content.constant";

export const ContentIdParam = z.object({
  id: z.uuid(CONTENT.ID.INVALID_MESSAGE),
});

export type ContentIdParamInput = z.infer<typeof ContentIdParam>;

export const ContentStatuses = ["PUBLISHED", "HIDDEN", "DELETED"] as const;

export const UpdatableContentStatuses = ["PUBLISHED", "HIDDEN"] as const;

export const ContentListSortKeys = ["TITLE", "STATUS", "CREATED_AT", "UPDATED_AT"] as const;

export const ContentListQuery = z.object({
  page: zOptionalInt().pipe(z.number().min(1).optional()),

  limit: zOptionalInt().pipe(z.number().min(1).max(100).optional()),

  status: zOptionalEnum(ContentStatuses),

  authorId: zOptionalString().pipe(z.uuid("작성자 식별자가 올바르지 않습니다.").optional()),

  sort: zOptionalEnum(ContentListSortKeys),

  order: zOptionalEnum(["asc", "desc"]),
});

export type ContentListQueryInput = z.infer<typeof ContentListQuery>;

export const CreateContentRequest = z.object({
  title: zRequiredString(CONTENT.TITLE.REQUIRED_MESSAGE).max(
    CONTENT.TITLE.MAX_LENGTH,
    CONTENT.TITLE.MAX_MESSAGE,
  ),

  content: zRequiredString(CONTENT.BODY.REQUIRED_MESSAGE),
});

export type CreateContentRequestInput = z.infer<typeof CreateContentRequest>;

export const UpdateContentRequest = z
  .object({
    title: z
      .string()
      .trim()
      .min(CONTENT.TITLE.MIN_LENGTH, CONTENT.TITLE.MIN_MESSAGE)
      .max(CONTENT.TITLE.MAX_LENGTH, CONTENT.TITLE.MAX_MESSAGE)
      .optional(),

    content: z.string().trim().min(CONTENT.BODY.MIN_LENGTH, CONTENT.BODY.MIN_MESSAGE).optional(),
  })
  .refine((input) => input.title !== undefined || input.content !== undefined, {
    message: "수정할 내용을 입력해 주세요.",
    path: ["content"],
  });

export type UpdateContentRequestInput = z.infer<typeof UpdateContentRequest>;

export const UpdateContentByIdRequest = ContentIdParam.merge(UpdateContentRequest);

export type UpdateContentByIdRequestInput = z.infer<typeof UpdateContentByIdRequest>;

export const UpdateContentStatusRequest = z.object({
  status: z.enum(UpdatableContentStatuses),
});

export type UpdateContentStatusRequestInput = z.infer<typeof UpdateContentStatusRequest>;

export const UpdateContentStatusByIdRequest = ContentIdParam.merge(UpdateContentStatusRequest);

export type UpdateContentStatusByIdRequestInput = z.infer<typeof UpdateContentStatusByIdRequest>;
