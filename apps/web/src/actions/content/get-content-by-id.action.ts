"use server";

import { getCurrentSession } from "@repo/auth/server";
import type { ActionResult } from "@repo/core/action";
import { logger } from "@repo/core/logger";
import { mapZodErrorToFieldErrors } from "@repo/core/validation";
import { ContentIdParam, type ContentDetailResponse } from "@repo/domain/content/client";
import { getContentByIdService } from "@repo/domain/content/server";

export async function getContentByIdAction(
  contentId: string,
): Promise<ActionResult<ContentDetailResponse>> {
  try {
    const parsed = ContentIdParam.safeParse({
      id: contentId,
    });

    if (!parsed.success) {
      return {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "콘텐츠 식별자를 확인해 주세요.",
        fieldErrors: mapZodErrorToFieldErrors(parsed.error),
      };
    }

    const session = await getCurrentSession();

    const actor = session
      ? {
          id: session.user.id,
          role: session.user.role,
          status: session.user.status,
        }
      : null;

    const result = await getContentByIdService(parsed.data.id, actor);

    if (!result.ok) {
      logger.warn("content.get_by_id.failed", {
        contentId: parsed.data.id,
        actorId: actor?.id,
        actorRole: actor?.role,
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
    logger.error("content.get_by_id.unexpected_error", {
      contentId,
      error,
    });

    return {
      ok: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "콘텐츠를 불러오는 중 오류가 발생했습니다.",
    };
  }
}
