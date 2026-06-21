"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@repo/auth/server";
import { createAction } from "@repo/core/action";
import { UpdateUserProfileRequest } from "@repo/domain/user/client";
import { updateUserProfileService } from "@repo/domain/user/server";

import { URLS } from "@/constants";

export async function updateMyProfileAction(_prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const result = await createAction({
    actionName: "user.update_my_profile",
    schema: UpdateUserProfileRequest,
    formData,
    handler: (input) => updateUserProfileService(session.user.id, input),
    successMessage: "프로필이 수정되었습니다.",
  });

  if (result.ok) {
    revalidatePath(URLS.CLIENT.MY_PAGE);
  }

  return result;
}
