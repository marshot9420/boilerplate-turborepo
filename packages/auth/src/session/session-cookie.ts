import "server-only";

import { cookies } from "next/headers";

import { serverEnv } from "@repo/env/server";

export async function getSessionCookieValue(): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get(serverEnv.AUTH_SESSION_COOKIE_NAME)?.value;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(serverEnv.AUTH_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: serverEnv.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: serverEnv.AUTH_SESSION_MAX_AGE_SECONDS,
  });
}

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(serverEnv.AUTH_SESSION_COOKIE_NAME);
}
