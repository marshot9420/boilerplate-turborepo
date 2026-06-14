import type { AppError } from "@repo/core/errors";

export const AUTH_ERROR_CODE = {
  UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  FORBIDDEN: "AUTH_FORBIDDEN",
  OAUTH_REQUEST_FAILED: "AUTH_OAUTH_REQUEST_FAILED",
  OAUTH_INVALID_TOKEN_RESPONSE: "AUTH_OAUTH_INVALID_TOKEN_RESPONSE",
  OAUTH_INVALID_PROFILE_RESPONSE: "AUTH_OAUTH_INVALID_PROFILE_RESPONSE",
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODE)[keyof typeof AUTH_ERROR_CODE];

export function createUnauthorizedError(): AppError {
  return {
    code: AUTH_ERROR_CODE.UNAUTHORIZED,
    message: "로그인이 필요합니다.",
  };
}

export function createForbiddenError(): AppError {
  return {
    code: AUTH_ERROR_CODE.FORBIDDEN,
    message: "접근 권한이 없습니다.",
  };
}

export function createOAuthRequestFailedError(cause?: unknown): AppError {
  return {
    code: AUTH_ERROR_CODE.OAUTH_REQUEST_FAILED,
    message: "OAuth 요청 처리 중 오류가 발생했습니다.",
    cause,
  };
}

export function createOAuthInvalidTokenResponseError(
  cause?: unknown,
): AppError {
  return {
    code: AUTH_ERROR_CODE.OAUTH_INVALID_TOKEN_RESPONSE,
    message: "OAuth 토큰 응답이 올바르지 않습니다.",
    cause,
  };
}

export function createOAuthInvalidProfileResponseError(
  cause?: unknown,
): AppError {
  return {
    code: AUTH_ERROR_CODE.OAUTH_INVALID_PROFILE_RESPONSE,
    message: "OAuth 사용자 정보 응답이 올바르지 않습니다.",
    cause,
  };
}
