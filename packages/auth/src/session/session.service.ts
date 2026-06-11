import "server-only";

import { updateUserRepository } from "@repo/database/user";
import {
  createUserSessionRepository,
  findUserSessionWithUserByTokenHashRepository,
  revokeUserSessionByTokenHashRepository,
} from "@repo/database/user-session";
import { serverEnv } from "@repo/env/server";

import {
  deleteSessionCookie,
  getSessionCookieValue,
  setSessionCookie,
} from "./session-cookie";
import {
  createSessionExpiresAt,
  createSessionToken,
  hashSessionToken,
} from "./session-token";

type DatabaseSessionWithUser = NonNullable<
  Awaited<ReturnType<typeof findUserSessionWithUserByTokenHashRepository>>
>;

export interface AuthSessionUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  nickname: string;
  role: DatabaseSessionWithUser["user"]["role"];
  status: DatabaseSessionWithUser["user"]["status"];
}

export interface AuthSession {
  id: string;
  expiresAt: Date;
  revokedAt: Date | null;
  user: AuthSessionUser;
}

export interface CreateAuthSessionInput {
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface CreateAuthSessionResult {
  token: string;
  sessionId: string;
  expiresAt: Date;
}

function toAuthSession(session: DatabaseSessionWithUser): AuthSession {
  return {
    id: session.id,
    expiresAt: session.expiresAt,
    revokedAt: session.revokedAt,
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      avatarUrl: session.user.avatarUrl,
      nickname: session.user.nickname,
      role: session.user.role,
      status: session.user.status,
    },
  };
}

function isUsableSession(session: DatabaseSessionWithUser): boolean {
  if (session.revokedAt) {
    return false;
  }

  if (session.expiresAt <= new Date()) {
    return false;
  }

  if (session.user.status !== "ACTIVE") {
    return false;
  }

  if (session.user.deletedAt) {
    return false;
  }

  return true;
}

export async function createAuthSession(
  input: CreateAuthSessionInput,
): Promise<CreateAuthSessionResult> {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = createSessionExpiresAt(
    serverEnv.AUTH_SESSION_MAX_AGE_SECONDS,
  );

  const session = await createUserSessionRepository({
    tokenHash,
    expiresAt,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
    user: {
      connect: {
        id: input.userId,
      },
    },
  });

  await updateUserRepository(input.userId, {
    lastLoginAt: new Date(),
  });

  await setSessionCookie(token);

  return {
    token,
    sessionId: session.id,
    expiresAt: session.expiresAt,
  };
}

export async function getAuthSessionByToken(
  token: string,
): Promise<AuthSession | null> {
  const tokenHash = hashSessionToken(token);

  const session = await findUserSessionWithUserByTokenHashRepository(tokenHash);

  if (!session) {
    return null;
  }

  if (!isUsableSession(session)) {
    return null;
  }

  return toAuthSession(session);
}

export async function getCurrentAuthSession(): Promise<AuthSession | null> {
  const token = await getSessionCookieValue();

  if (!token) {
    return null;
  }

  return getAuthSessionByToken(token);
}

export async function revokeAuthSessionByToken(token: string): Promise<number> {
  const tokenHash = hashSessionToken(token);

  return revokeUserSessionByTokenHashRepository(tokenHash);
}

export async function revokeCurrentAuthSession(): Promise<void> {
  const token = await getSessionCookieValue();

  if (token) {
    await revokeAuthSessionByToken(token);
  }

  await deleteSessionCookie();
}
