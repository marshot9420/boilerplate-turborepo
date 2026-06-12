import "server-only";

import { randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { serverEnv } from "@repo/env/server";

import type { OAuthProviderId } from "./oauth-provider";

const OAUTH_STATE_BYTE_LENGTH = 32;
const OAUTH_STATE_MAX_AGE_SECONDS = 60 * 10;

export function createOAuthState(): string {
  return randomBytes(OAUTH_STATE_BYTE_LENGTH).toString("base64url");
}

function getOAuthStateCookieName(providerId: OAuthProviderId): string {
  return `${serverEnv.AUTH_SESSION_COOKIE_NAME}_${providerId}_oauth_state`;
}

export async function setOAuthStateCookie(params: {
  providerId: OAuthProviderId;
  state: string;
}): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(getOAuthStateCookieName(params.providerId), params.state, {
    httpOnly: true,
    secure: serverEnv.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: OAUTH_STATE_MAX_AGE_SECONDS,
  });
}

export async function getOAuthStateCookieValue(
  providerId: OAuthProviderId,
): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get(getOAuthStateCookieName(providerId))?.value;
}

export async function deleteOAuthStateCookie(
  providerId: OAuthProviderId,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(getOAuthStateCookieName(providerId));
}

export async function verifyOAuthStateCookie(params: {
  providerId: OAuthProviderId;
  state: string | null | undefined;
}): Promise<boolean> {
  const storedState = await getOAuthStateCookieValue(params.providerId);

  await deleteOAuthStateCookie(params.providerId);

  if (!storedState || !params.state) {
    return false;
  }

  return storedState === params.state;
}
