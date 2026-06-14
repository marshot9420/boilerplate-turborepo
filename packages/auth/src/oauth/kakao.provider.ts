import "server-only";

import { serverEnv } from "@repo/env/server";

import {
  createOAuthInvalidProfileResponseError,
  createOAuthInvalidTokenResponseError,
  createOAuthRequestFailedError,
} from "../auth.error";
import type { OAuthProfile } from "./oauth-profile";

const KAKAO_TOKEN_ENDPOINT = "https://kauth.kakao.com/oauth/token";
const KAKAO_USERINFO_ENDPOINT = "https://kapi.kakao.com/v2/user/me";

interface ExchangeKakaoOAuthCodeParams {
  code: string;
  appBaseUrl: string;
  callbackPath: string;
}

interface GetKakaoOAuthProfileByCodeParams {
  code: string;
  appBaseUrl: string;
  callbackPath: string;
}

interface KakaoOAuthTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number | null;
  refreshToken: string | null;
  refreshTokenExpiresIn: number | null;
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

function toKakaoOAuthTokenResponse(value: unknown): KakaoOAuthTokenResponse {
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
    refreshToken: getStringProperty(value, "refresh_token"),
    refreshTokenExpiresIn: getNumberProperty(value, "refresh_token_expires_in"),
    scope: getStringProperty(value, "scope"),
    idToken: getStringProperty(value, "id_token"),
  };
}

function toKakaoOAuthProfile(value: unknown): OAuthProfile {
  if (!isRecord(value)) {
    throw createOAuthInvalidProfileResponseError(value);
  }

  const id = value.id;

  if (typeof id !== "number" && typeof id !== "string") {
    throw createOAuthInvalidProfileResponseError(value);
  }

  const kakaoAccount = value.kakao_account;

  if (!isRecord(kakaoAccount)) {
    throw createOAuthInvalidProfileResponseError(value);
  }

  const email = getStringProperty(kakaoAccount, "email");
  const isEmailValid = getBooleanProperty(kakaoAccount, "is_email_valid");
  const isEmailVerified = getBooleanProperty(kakaoAccount, "is_email_verified");

  if (!email || isEmailValid === false || isEmailVerified === false) {
    throw createOAuthInvalidProfileResponseError(value);
  }

  const profile = kakaoAccount.profile;

  const name = isRecord(profile)
    ? getStringProperty(profile, "nickname")
    : null;

  const avatarUrl = isRecord(profile)
    ? getStringProperty(profile, "profile_image_url")
    : null;

  return {
    provider: "KAKAO",
    providerUserId: String(id),
    email,
    name,
    avatarUrl,
  };
}

export async function exchangeKakaoOAuthCode(
  params: ExchangeKakaoOAuthCodeParams,
): Promise<KakaoOAuthTokenResponse> {
  const redirectUri = createOAuthRedirectUri({
    appBaseUrl: params.appBaseUrl,
    callbackPath: params.callbackPath,
  });

  const body = new URLSearchParams();

  body.set("grant_type", "authorization_code");
  body.set("client_id", serverEnv.KAKAO_CLIENT_ID);
  body.set("client_secret", serverEnv.KAKAO_CLIENT_SECRET);
  body.set("code", params.code);
  body.set("redirect_uri", redirectUri);

  const response = await fetch(KAKAO_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body,
  });

  const json = await readJsonResponse(response);

  if (!response.ok) {
    throw createOAuthRequestFailedError(json);
  }

  return toKakaoOAuthTokenResponse(json);
}

export async function getKakaoOAuthProfile(
  accessToken: string,
): Promise<OAuthProfile> {
  const response = await fetch(KAKAO_USERINFO_ENDPOINT, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  const json = await readJsonResponse(response);

  if (!response.ok) {
    throw createOAuthRequestFailedError(json);
  }

  return toKakaoOAuthProfile(json);
}

export async function getKakaoOAuthProfileByCode(
  params: GetKakaoOAuthProfileByCodeParams,
): Promise<OAuthProfile> {
  const token = await exchangeKakaoOAuthCode(params);

  return getKakaoOAuthProfile(token.accessToken);
}
