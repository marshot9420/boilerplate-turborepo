export const CONTENT_ERROR_CODE = {
  NOT_FOUND: "CONTENT_NOT_FOUND",
  FORBIDDEN: "CONTENT_FORBIDDEN",
  DELETED: "CONTENT_DELETED",
} as const;

export type ContentErrorCode =
  (typeof CONTENT_ERROR_CODE)[keyof typeof CONTENT_ERROR_CODE];
