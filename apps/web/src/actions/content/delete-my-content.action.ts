"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@repo/auth/server";
import type { ActionResult } from "@repo/core/action";
import { executeFormAction } from "@repo/core/action";
import { ContentIdParam, type ContentDetailResponse } from "@repo/domain/content/client";
import { softDeleteContentService } from "@repo/domain/content/server";

import { URLS } from "@/constants";

function createContentDetailHref(contentId: string) {
  return `${URLS.CLIENT.CONTENTS}/${contentId}`;
}

function createContentEditHref(contentId: string) {
  return `${URLS.CLIENT.CONTENTS}/${contentId}/edit`;
}

export async function deleteMyContentAction(
  _prevState: ActionResult<ContentDetailResponse> | null,
  formData: FormData,
) {
  const session = await requireUser();

  const result = await executeFormAction({
    actionName: "content.delete_my_content",
    schema: ContentIdParam,
    formData,
    handler: ({ id }) =>
      softDeleteContentService(id, {
        id: session.user.id,
        role: session.user.role,
        status: session.user.status,
      }),
    successMessage: "콘텐츠가 삭제되었습니다.",
  });

  if (result.ok) {
    revalidatePath(URLS.CLIENT.HOME);
    revalidatePath(URLS.CLIENT.CONTENTS);
    revalidatePath(URLS.CLIENT.MY_PAGE);
    revalidatePath(createContentDetailHref(result.data.id));
    revalidatePath(createContentEditHref(result.data.id));
  }

  return result;
}
