import type { AppError } from "@repo/core/errors";

export const AUTH_ERROR_CODE = {
  UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  FORBIDDEN: "AUTH_FORBIDDEN",
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
