import { getUserByIdService } from "@repo/domain/user/server";

import { requirePageUser } from "@/shared/auth";
import { MyProfileView } from "@/views/my-profile-view";

export const runtime = "nodejs";

export default async function MePage() {
  const session = await requirePageUser();

  const result = await getUserByIdService(session.user.id);

  return <MyProfileView result={result} />;
}
