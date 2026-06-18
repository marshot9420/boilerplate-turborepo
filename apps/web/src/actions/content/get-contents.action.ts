"use server";

import type { ActionResult } from "@repo/core/action";
import { logger } from "@repo/core/logger";
import { mapZodErrorToFieldErrors } from "@repo/core/validation";
import {
  ContentListQuery,
  type ContentListQueryInput,
  type ContentListResponse,
} from "@repo/domain/content/client";
import { getContentsService } from "@repo/domain/content/server";

export async function getContentsAction(
  query: ContentListQueryInput = {},
): Promise<ActionResult<ContentListResponse>> {
  try {
    const parsed = ContentListQuery.safeParse(query);

    if (!parsed.success) {
      return {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "조회 조건을 확인해 주세요.",
        fieldErrors: mapZodErrorToFieldErrors(parsed.error),
      };
    }

    const result = await getContentsService({
      page: parsed.data.page,
      limit: parsed.data.limit,
      authorId: parsed.data.authorId,
      status: "PUBLISHED",
    });

    if (!result.ok) {
      logger.warn("content.get_list.failed", {
        code: result.error.code,
        message: result.error.message,
      });

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
  } catch (error) {
    logger.error("content.get_list.unexpected_error", {
      query,
      error,
    });

    return {
      ok: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "콘텐츠 목록을 불러오는 중 오류가 발생했습니다.",
    };
  }
}
