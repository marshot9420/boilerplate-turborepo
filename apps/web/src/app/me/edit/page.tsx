import { requireUser } from "@repo/auth/server";
import { getUserByIdService } from "@repo/domain/user/server";

import { UpdateMyProfileView } from "@/views/update-my-profile-view";

export const runtime = "nodejs";

export default async function EditMePage() {
  const session = await requireUser();

  const result = await getUserByIdService(session.user.id);

  return <UpdateMyProfileView result={result} />;
}
