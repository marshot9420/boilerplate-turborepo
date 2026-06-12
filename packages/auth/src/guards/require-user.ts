import "server-only";

import { createUnauthorizedError } from "../auth.error";
import { getCurrentAuthSession, type AuthSession } from "../session";

export async function requireUser(): Promise<AuthSession> {
  const session = await getCurrentAuthSession();

  if (!session) {
    throw createUnauthorizedError();
  }

  return session;
}
