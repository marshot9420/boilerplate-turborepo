"use server";

import { requireUser } from "@repo/auth/server";
import type { ActionResult } from "@repo/core/action";
import { logger } from "@repo/core/logger";
import type { UserDetailResponse } from "@repo/domain/user/client";
import { getUserByIdService } from "@repo/domain/user/server";

export async function getMyProfileAction(): Promise<ActionResult<UserDetailResponse>> {
  try {
    const user = await requireUser();

    const result = await getUserByIdService(user.id);

    if (!result.ok) {
      logger.warn("user.get_my_profile.failed", {
        userId: user.id,
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
    logger.error("user.get_my_profile.unexpected_error", {
      error,
    });

    return {
      ok: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "내 정보를 불러오는 중 오류가 발생했습니다.",
    };
  }
}
