import "server-only";

import { serverEnv } from "@repo/env/server";

import {
  createOAuthInvalidProfileResponseError,
  createOAuthInvalidTokenResponseError,
  createOAuthRequestFailedError,
} from "../auth.error";
import type { OAuthProfile } from "./oauth-profile";

const NAVER_TOKEN_ENDPOINT = "https://nid.naver.com/oauth2.0/token";
const NAVER_USERINFO_ENDPOINT = "https://openapi.naver.com/v1/nid/me";

interface ExchangeNaverOAuthCodeParams {
  code: string;
  state: string;
  appBaseUrl: string;
  callbackPath: string;
}

interface GetNaverOAuthProfileByCodeParams {
  code: string;
  state: string;
  appBaseUrl: string;
  callbackPath: string;
}

interface NaverOAuthTokenResponse {
  accessToken: string;
  refreshToken: string | null;
  tokenType: string;
  expiresIn: string | null;
  error: string | null;
  errorDescription: string | null;
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

async function readJsonResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    throw createOAuthRequestFailedError(error);
  }
}

function toNaverOAuthTokenResponse(value: unknown): NaverOAuthTokenResponse {
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
    refreshToken: getStringProperty(value, "refresh_token"),
    expiresIn: getStringProperty(value, "expires_in"),
    error: getStringProperty(value, "error"),
    errorDescription: getStringProperty(value, "error_description"),
  };
}

function toNaverOAuthProfile(value: unknown): OAuthProfile {
  if (!isRecord(value)) {
    throw createOAuthInvalidProfileResponseError(value);
  }

  const response = value.response;

  if (!isRecord(response)) {
    throw createOAuthInvalidProfileResponseError(value);
  }

  const providerUserId = getStringProperty(response, "id");
  const email = getStringProperty(response, "email");

  if (!providerUserId || !email) {
    throw createOAuthInvalidProfileResponseError(value);
  }

  return {
    provider: "NAVER",
    providerUserId,
    email,
    name: getStringProperty(response, "name"),
    avatarUrl: getStringProperty(response, "profile_image"),
  };
}

export async function exchangeNaverOAuthCode(
  params: ExchangeNaverOAuthCodeParams,
): Promise<NaverOAuthTokenResponse> {
  const redirectUri = createOAuthRedirectUri({
    appBaseUrl: params.appBaseUrl,
    callbackPath: params.callbackPath,
  });

  const url = new URL(NAVER_TOKEN_ENDPOINT);

  url.searchParams.set("grant_type", "authorization_code");
  url.searchParams.set("client_id", serverEnv.NAVER_CLIENT_ID);
  url.searchParams.set("client_secret", serverEnv.NAVER_CLIENT_SECRET);
  url.searchParams.set("code", params.code);
  url.searchParams.set("state", params.state);
  url.searchParams.set("redirect_uri", redirectUri);

  const response = await fetch(url, {
    method: "GET",
  });

  const json = await readJsonResponse(response);

  if (!response.ok) {
    throw createOAuthRequestFailedError(json);
  }

  return toNaverOAuthTokenResponse(json);
}

export async function getNaverOAuthProfile(
  accessToken: string,
): Promise<OAuthProfile> {
  const response = await fetch(NAVER_USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await readJsonResponse(response);

  if (!response.ok) {
    throw createOAuthRequestFailedError(json);
  }

  return toNaverOAuthProfile(json);
}

export async function getNaverOAuthProfileByCode(
  params: GetNaverOAuthProfileByCodeParams,
): Promise<OAuthProfile> {
  const token = await exchangeNaverOAuthCode(params);

  return getNaverOAuthProfile(token.accessToken);
}
