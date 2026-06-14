import "server-only";

import type { AppError } from "@repo/core/errors";
import { findOrCreateOAuthUserService } from "@repo/domain/user/server";

import {
  createOAuthInvalidStateError,
  createOAuthMissingCodeError,
} from "../auth.error";
import { createAuthSession } from "../session";
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

export interface HandleOAuthCallbackParams extends ResolveOAuthCallbackProfileParams {
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface HandleOAuthCallbackResult {
  userId: string;
  sessionId: string;
  expiresAt: Date;
}

function throwAppError(error: AppError): never {
  throw error;
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

export async function handleOAuthCallback(
  params: HandleOAuthCallbackParams,
): Promise<HandleOAuthCallbackResult> {
  const profile = await resolveOAuthCallbackProfile(params);

  const userResult = await findOrCreateOAuthUserService({
    provider: profile.provider,
    providerUserId: profile.providerUserId,
    email: profile.email,
    name: profile.name,
    avatarUrl: profile.avatarUrl,
  });

  if (!userResult.ok) {
    throwAppError(userResult.error);
  }

  const session = await createAuthSession({
    userId: userResult.data.id,
    ipAddress: params.ipAddress ?? null,
    userAgent: params.userAgent ?? null,
  });

  return {
    userId: userResult.data.id,
    sessionId: session.sessionId,
    expiresAt: session.expiresAt,
  };
}
