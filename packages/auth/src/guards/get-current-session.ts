import "server-only";

import { getCurrentAuthSession, type AuthSession } from "../session";

export async function getCurrentSession(): Promise<AuthSession | null> {
  return getCurrentAuthSession();
}
