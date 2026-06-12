import "server-only";

import { createForbiddenError, createUnauthorizedError } from "../auth.error";
import { getCurrentAuthSession, type AuthSession } from "../session";

export async function requireAdmin(): Promise<AuthSession> {
  const session = await getCurrentAuthSession();

  if (!session) {
    throw createUnauthorizedError();
  }

  if (session.user.role !== "ADMIN") {
    throw createForbiddenError();
  }

  return session;
}
