import { getUserByIdService } from "@repo/domain/user/server";

import { requirePageUser } from "@/shared/auth";
import { UpdateMyProfileView } from "@/views/update-my-profile-view";

export const runtime = "nodejs";

export default async function EditMePage() {
  const session = await requirePageUser();

  const result = await getUserByIdService(session.user.id);

  return <UpdateMyProfileView result={result} />;
}
