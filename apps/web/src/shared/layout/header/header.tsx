import { getCurrentAuthSession } from "@repo/auth/server";

import HeaderView from "./header-view";

async function getHeaderSession() {
  try {
    return await getCurrentAuthSession();
  } catch {
    return null;
  }
}

export default async function Header() {
  const session = await getHeaderSession();

  return <HeaderView isAuthenticated={Boolean(session)} />;
}
