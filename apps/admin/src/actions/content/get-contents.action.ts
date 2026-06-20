"use server";

import { requireAdmin } from "@repo/auth/server";
import type { ActionResult } from "@repo/core/action";
import { mapZodErrorToFieldErrors } from "@repo/core/validation";
import { ContentListQuery, type ContentListResponse } from "@repo/domain/content/client";
import { getContentsService } from "@repo/domain/content/server";

export async function getContentsAction(
  query: unknown = {},
): Promise<ActionResult<ContentListResponse>> {
  await requireAdmin();

  const parsed = ContentListQuery.safeParse(query);

  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "콘텐츠 목록 조회 조건을 확인해 주세요.",
      fieldErrors: mapZodErrorToFieldErrors(parsed.error),
    };
  }

  const result = await getContentsService(parsed.data);

  if (!result.ok) {
    return {
      ok: false,
      code: result.error.code,
      message: result.error.message,
      fieldErrors: result.error.fieldErrors,
    };
  }

  return {
    ok: true,
    data: result.data,
  };
}
