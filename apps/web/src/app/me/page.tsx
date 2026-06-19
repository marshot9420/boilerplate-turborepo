import { getMyProfileAction } from "@/actions/user";
import { MyProfileView } from "@/views/my-profile-view";

export const runtime = "nodejs";

export default async function MePage() {
  const result = await getMyProfileAction();

  return <MyProfileView result={result} />;
}
