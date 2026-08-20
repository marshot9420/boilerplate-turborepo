"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@repo/auth/server";
import type { ActionResult } from "@repo/core/action";
import { executeFormAction } from "@repo/core/action";
import { CreateContentRequest, type ContentDetailResponse } from "@repo/domain/content/client";
import { createContentService } from "@repo/domain/content/server";

import { URLS } from "@/constants";

export async function createContentAction(
  _prevState: ActionResult<ContentDetailResponse> | null,
  formData: FormData,
) {
  const session = await requireUser();

  const result = await executeFormAction({
    actionName: "content.create",
    schema: CreateContentRequest,
    formData,
    handler: (input) =>
      createContentService(
        {
          id: session.user.id,
          role: session.user.role,
          status: session.user.status,
        },
        input,
      ),
    successMessage: "콘텐츠가 생성되었습니다.",
  });

  if (result.ok) {
    revalidatePath(URLS.CLIENT.HOME);
    revalidatePath(URLS.CLIENT.MY_PAGE);
  }

  return result;
}
