import { type AppError } from "@repo/core/errors";

export const USER_ERROR_CODE = {
  NOT_FOUND: "USER_NOT_FOUND",
  EMAIL_DUPLICATED: "USER_EMAIL_DUPLICATED",
  NICKNAME_DUPLICATED: "USER_NICKNAME_DUPLICATED",
  FORBIDDEN: "USER_FORBIDDEN",
  DELETED: "USER_DELETED",
  SUSPENDED: "USER_SUSPENDED",
  BANNED: "USER_BANNED",
  OAUTH_USER_BLOCKED: "USER_OAUTH_USER_BLOCKED",
  OAUTH_LOGIN_FAILED: "USER_OAUTH_LOGIN_FAILED",
} as const;

export type UserErrorCode = (typeof USER_ERROR_CODE)[keyof typeof USER_ERROR_CODE];

export function createOAuthUserBlockedError(): AppError {
  return {
    code: USER_ERROR_CODE.OAUTH_USER_BLOCKED,
    message: "사용할 수 없는 계정입니다.",
  };
}

export function createOAuthLoginFailedError(cause?: unknown): AppError {
  return {
    code: USER_ERROR_CODE.OAUTH_LOGIN_FAILED,
    message: "소셜 로그인 처리 중 오류가 발생했습니다.",
    cause,
  };
}
