"use server";

import { redirect } from "next/navigation";

import { requireUser, revokeCurrentAuthSession } from "@repo/auth/server";
import { createAction } from "@repo/core/action";
import { DeleteMyAccountRequest } from "@repo/domain/user/client";
import { softDeleteUserService } from "@repo/domain/user/server";

import { URLS } from "@/constants";

export async function deleteMyAccountAction(_prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const result = await createAction({
    actionName: "user.delete_my_account",
    schema: DeleteMyAccountRequest,
    formData,
    handler: () => softDeleteUserService(session.user.id),
    successMessage: "회원 탈퇴가 완료되었습니다.",
  });

  if (!result.ok) {
    return result;
  }

  await revokeCurrentAuthSession();

  redirect(URLS.CLIENT.LOGIN);
}
