export const STORAGE_ERROR_CODE = {
  UPLOAD_FAILED: "STORAGE.UPLOAD_FAILED",
  DELETE_FAILED: "STORAGE.DELETE_FAILED",
  PUBLIC_URL_FAILED: "STORAGE.PUBLIC_URL_FAILED",
  SIGNED_URL_FAILED: "STORAGE.SIGNED_URL_FAILED",
  INVALID_INPUT: "STORAGE.INVALID_INPUT",
} as const;

export type StorageErrorCode = (typeof STORAGE_ERROR_CODE)[keyof typeof STORAGE_ERROR_CODE];

export interface StorageError {
  code: StorageErrorCode;
  message: string;
  cause?: unknown;
}

export function createStorageError(
  code: StorageErrorCode,
  message: string,
  cause?: unknown,
): StorageError {
  return {
    code,
    message,
    cause,
  };
}
