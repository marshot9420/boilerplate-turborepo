"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@repo/auth/server";
import { createAction } from "@repo/core/action";
import { CreateContentRequest } from "@repo/domain/content/client";
import { createContentService } from "@repo/domain/content/server";

import { URLS } from "@/constants";

const CreateMyContentActionRequest = CreateContentRequest.omit({
  authorId: true,
});

export async function createContentAction(
  _prevState: unknown,
  formData: FormData,
) {
  const session = await requireUser();

  const result = await createAction({
    actionName: "content.create",
    schema: CreateMyContentActionRequest,
    formData,
    handler: (input) =>
      createContentService({
        ...input,
        authorId: session.user.id,
      }),
    successMessage: "콘텐츠가 생성되었습니다.",
  });

  if (result.ok) {
    revalidatePath(URLS.CLIENT.HOME);
    revalidatePath(URLS.CLIENT.MY_PAGE);
  }

  return result;
}
