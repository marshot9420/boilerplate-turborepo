import "server-only";

import { serverEnv } from "@repo/env/server";

import {
  createOAuthInvalidProfileResponseError,
  createOAuthInvalidTokenResponseError,
  createOAuthRequestFailedError,
} from "../auth.error";
import type { OAuthProfile } from "./oauth-profile";

const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_ENDPOINT =
  "https://openidconnect.googleapis.com/v1/userinfo";

interface ExchangeGoogleOAuthCodeParams {
  code: string;
  appBaseUrl: string;
  callbackPath: string;
}

interface GetGoogleOAuthProfileByCodeParams {
  code: string;
  appBaseUrl: string;
  callbackPath: string;
}

interface GoogleOAuthTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number | null;
  scope: string | null;
  idToken: string | null;
}

function createOAuthRedirectUri(params: {
  appBaseUrl: string;
  callbackPath: string;
}): string {
  return new URL(params.callbackPath, params.appBaseUrl).toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStringProperty(
  value: Record<string, unknown>,
  key: string,
): string | null {
  const property = value[key];

  if (typeof property !== "string") {
    return null;
  }

  return property;
}

function getNumberProperty(
  value: Record<string, unknown>,
  key: string,
): number | null {
  const property = value[key];

  if (typeof property !== "number") {
    return null;
  }

  return property;
}

function getBooleanProperty(
  value: Record<string, unknown>,
  key: string,
): boolean | null {
  const property = value[key];

  if (typeof property !== "boolean") {
    return null;
  }

  return property;
}

async function readJsonResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    throw createOAuthRequestFailedError(error);
  }
}

function toGoogleOAuthTokenResponse(value: unknown): GoogleOAuthTokenResponse {
  if (!isRecord(value)) {
    throw createOAuthInvalidTokenResponseError(value);
  }

  const accessToken = getStringProperty(value, "access_token");
  const tokenType = getStringProperty(value, "token_type");

  if (!accessToken || !tokenType) {
    throw createOAuthInvalidTokenResponseError(value);
  }

  return {
    accessToken,
    tokenType,
    expiresIn: getNumberProperty(value, "expires_in"),
    scope: getStringProperty(value, "scope"),
    idToken: getStringProperty(value, "id_token"),
  };
}

function toGoogleOAuthProfile(value: unknown): OAuthProfile {
  if (!isRecord(value)) {
    throw createOAuthInvalidProfileResponseError(value);
  }

  const providerUserId = getStringProperty(value, "sub");
  const email = getStringProperty(value, "email");
  const emailVerified = getBooleanProperty(value, "email_verified");

  if (!providerUserId || !email || emailVerified !== true) {
    throw createOAuthInvalidProfileResponseError(value);
  }

  return {
    provider: "GOOGLE",
    providerUserId,
    email,
    name: getStringProperty(value, "name"),
    avatarUrl: getStringProperty(value, "picture"),
  };
}

export async function exchangeGoogleOAuthCode(
  params: ExchangeGoogleOAuthCodeParams,
): Promise<GoogleOAuthTokenResponse> {
  const redirectUri = createOAuthRedirectUri({
    appBaseUrl: params.appBaseUrl,
    callbackPath: params.callbackPath,
  });

  const body = new URLSearchParams();

  body.set("client_id", serverEnv.GOOGLE_CLIENT_ID);
  body.set("client_secret", serverEnv.GOOGLE_CLIENT_SECRET);
  body.set("code", params.code);
  body.set("grant_type", "authorization_code");
  body.set("redirect_uri", redirectUri);

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const json = await readJsonResponse(response);

  if (!response.ok) {
    throw createOAuthRequestFailedError(json);
  }

  return toGoogleOAuthTokenResponse(json);
}

export async function getGoogleOAuthProfile(
  accessToken: string,
): Promise<OAuthProfile> {
  const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await readJsonResponse(response);

  if (!response.ok) {
    throw createOAuthRequestFailedError(json);
  }

  return toGoogleOAuthProfile(json);
}

export async function getGoogleOAuthProfileByCode(
  params: GetGoogleOAuthProfileByCodeParams,
): Promise<OAuthProfile> {
  const token = await exchangeGoogleOAuthCode(params);

  return getGoogleOAuthProfile(token.accessToken);
}
