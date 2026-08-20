"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@repo/auth/server";
import type { ActionResult } from "@repo/core/action";
import { executeFormAction } from "@repo/core/action";
import {
  type ContentDetailResponse,
  UpdateContentStatusByIdRequest,
} from "@repo/domain/content/client";
import { updateContentStatusService } from "@repo/domain/content/server";

import { URLS } from "@/constants";

export async function updateContentStatusAction(
  _prevState: ActionResult<ContentDetailResponse> | null,
  formData: FormData,
) {
  const session = await requireAdmin();

  const result = await executeFormAction({
    actionName: "admin.content.update_status",
    schema: UpdateContentStatusByIdRequest,
    formData,
    handler: ({ id, ...input }) =>
      updateContentStatusService(
        id,
        {
          id: session.user.id,
          role: session.user.role,
          status: session.user.status,
        },
        input,
      ),
    successMessage: "콘텐츠 상태가 변경되었습니다.",
  });

  if (result.ok) {
    revalidatePath(URLS.CLIENT.CONTENTS);
  }

  return result;
}
