import "server-only";

import { serverEnv } from "@repo/env/server";

import type { OAuthProviderId } from "./oauth-provider";
import { createOAuthState, setOAuthStateCookie } from "./oauth-state";

const OAuthAuthorizeEndpointMap = {
  google: "https://accounts.google.com/o/oauth2/v2/auth",
  naver: "https://nid.naver.com/oauth2.0/authorize",
  kakao: "https://kauth.kakao.com/oauth/authorize",
} as const satisfies Record<OAuthProviderId, string>;

const OAuthDefaultScopeMap = {
  google: ["openid", "email", "profile"],
  naver: [],
  kakao: ["profile", "account_email"],
} as const satisfies Record<OAuthProviderId, readonly string[]>;

const OAuthScopeSeparatorMap = {
  google: " ",
  naver: " ",
  kakao: ",",
} as const satisfies Record<OAuthProviderId, string>;

export interface BuildOAuthAuthorizeUrlParams {
  providerId: OAuthProviderId;
  appBaseUrl: string;
  callbackPath: string;
  state: string;
  scopes?: readonly string[];
}

export interface CreateOAuthAuthorizeUrlParams {
  providerId: OAuthProviderId;
  appBaseUrl: string;
  callbackPath: string;
  scopes?: readonly string[];
}

function getOAuthClientId(providerId: OAuthProviderId): string {
  switch (providerId) {
    case "google":
      return serverEnv.GOOGLE_CLIENT_ID;

    case "naver":
      return serverEnv.NAVER_CLIENT_ID;

    case "kakao":
      return serverEnv.KAKAO_CLIENT_ID;
  }
}

function createOAuthRedirectUri(params: { appBaseUrl: string; callbackPath: string }): string {
  return new URL(params.callbackPath, params.appBaseUrl).toString();
}

function getOAuthScopes(params: {
  providerId: OAuthProviderId;
  scopes?: readonly string[];
}): readonly string[] {
  return params.scopes ?? OAuthDefaultScopeMap[params.providerId];
}

function appendOAuthScope(params: {
  url: URL;
  providerId: OAuthProviderId;
  scopes: readonly string[];
}): void {
  if (params.scopes.length === 0) {
    return;
  }

  params.url.searchParams.set(
    "scope",
    params.scopes.join(OAuthScopeSeparatorMap[params.providerId]),
  );
}

export function buildOAuthAuthorizeUrl(params: BuildOAuthAuthorizeUrlParams): string {
  const url = new URL(OAuthAuthorizeEndpointMap[params.providerId]);

  const redirectUri = createOAuthRedirectUri({
    appBaseUrl: params.appBaseUrl,
    callbackPath: params.callbackPath,
  });

  const scopes = getOAuthScopes({
    providerId: params.providerId,
    scopes: params.scopes,
  });

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", getOAuthClientId(params.providerId));
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", params.state);

  appendOAuthScope({
    url,
    providerId: params.providerId,
    scopes,
  });

  return url.toString();
}

export async function createOAuthAuthorizeUrl(
  params: CreateOAuthAuthorizeUrlParams,
): Promise<string> {
  const state = createOAuthState();

  await setOAuthStateCookie({
    providerId: params.providerId,
    state,
  });

  return buildOAuthAuthorizeUrl({
    providerId: params.providerId,
    appBaseUrl: params.appBaseUrl,
    callbackPath: params.callbackPath,
    state,
    scopes: params.scopes,
  });
}
