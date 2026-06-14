import "server-only";

import {
  createOAuthInvalidStateError,
  createOAuthMissingCodeError,
} from "../auth.error";
import { getGoogleOAuthProfileByCode } from "./google.provider";
import { getKakaoOAuthProfileByCode } from "./kakao.provider";
import { getNaverOAuthProfileByCode } from "./naver.provider";
import type { OAuthProfile } from "./oauth-profile";
import type { OAuthProviderId } from "./oauth-provider";
import { verifyOAuthStateCookie } from "./oauth-state";

export interface ResolveOAuthCallbackProfileParams {
  providerId: OAuthProviderId;
  code: string | null | undefined;
  state: string | null | undefined;
  appBaseUrl: string;
  callbackPath: string;
}

export async function resolveOAuthCallbackProfile(
  params: ResolveOAuthCallbackProfileParams,
): Promise<OAuthProfile> {
  if (!params.code) {
    throw createOAuthMissingCodeError();
  }

  const validState = await verifyOAuthStateCookie({
    providerId: params.providerId,
    state: params.state,
  });

  if (!validState || !params.state) {
    throw createOAuthInvalidStateError();
  }

  switch (params.providerId) {
    case "google":
      return getGoogleOAuthProfileByCode({
        code: params.code,
        appBaseUrl: params.appBaseUrl,
        callbackPath: params.callbackPath,
      });

    case "naver":
      return getNaverOAuthProfileByCode({
        code: params.code,
        state: params.state,
        appBaseUrl: params.appBaseUrl,
        callbackPath: params.callbackPath,
      });

    case "kakao":
      return getKakaoOAuthProfileByCode({
        code: params.code,
        appBaseUrl: params.appBaseUrl,
        callbackPath: params.callbackPath,
      });
  }
}
