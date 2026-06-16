"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@repo/auth/server";
import type { ActionResult } from "@repo/core/action";
import { createAction } from "@repo/core/action";
import { UpdateContentByIdRequest, type ContentDetailResponse } from "@repo/domain/content/client";
import { updateContentService } from "@repo/domain/content/server";

import { URLS } from "@/constants";

export async function updateMyContentAction(
  _prevState: ActionResult<ContentDetailResponse> | null,
  formData: FormData,
) {
  const session = await requireUser();

  const result = await createAction({
    actionName: "content.update_my_content",
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
    revalidatePath(URLS.CLIENT.HOME);
    revalidatePath(URLS.CLIENT.MY_PAGE);
  }

  return result;
}
