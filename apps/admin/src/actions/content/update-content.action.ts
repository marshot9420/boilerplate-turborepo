"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@repo/auth/server";
import type { ActionResult } from "@repo/core/action";
import { createAction } from "@repo/core/action";
import {
  type ContentDetailResponse,
  UpdateContentByIdRequest,
} from "@repo/domain/content/client";
import { updateContentService } from "@repo/domain/content/server";

import { URLS } from "@/constants";

export async function updateContentAction(
  _prevState: ActionResult<ContentDetailResponse> | null,
  formData: FormData,
) {
  const session = await requireAdmin();

  const result = await createAction({
    actionName: "admin.content.update",
    schema: UpdateContentByIdRequest,
    formData,
    handler: ({ id, ...input }) =>
      updateContentService(
        id,
        {
          id: session.user.id,
          role: session.user.role,
          status: session.user.status,
        },
        input,
      ),
    successMessage: "콘텐츠가 수정되었습니다.",
  });

  if (result.ok) {
    revalidatePath(URLS.CLIENT.CONTENTS);
  }

  return result;
}
