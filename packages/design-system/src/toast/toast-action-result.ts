"use client";

import { toast, type ExternalToast } from "sonner";

import type { ActionResult } from "@repo/core/action";

export const DEFAULT_TOAST_SUCCESS_MESSAGE = "처리되었습니다.";
export const DEFAULT_TOAST_ERROR_MESSAGE = "요청 처리에 실패했습니다.";

export interface ToastActionResultOptions {
  successMessage?: string;
  errorMessage?: string;
  successToastOptions?: ExternalToast;
  errorToastOptions?: ExternalToast;
}

function resolveToastMessage(
  message: string | undefined,
  fallbackMessage: string | undefined,
  defaultMessage: string,
): string {
  const resolvedMessage = message?.trim();

  if (resolvedMessage) {
    return resolvedMessage;
  }

  const resolvedFallbackMessage = fallbackMessage?.trim();

  if (resolvedFallbackMessage) {
    return resolvedFallbackMessage;
  }

  return defaultMessage;
}

export function toastActionResult<TData>(
  result: ActionResult<TData> | null | undefined,
  options: ToastActionResultOptions = {},
): void {
  if (!result) {
    return;
  }

  if (result.ok) {
    toast.success(
      resolveToastMessage(result.message, options.successMessage, DEFAULT_TOAST_SUCCESS_MESSAGE),
      options.successToastOptions,
    );

    return;
  }

  toast.error(
    resolveToastMessage(result.message, options.errorMessage, DEFAULT_TOAST_ERROR_MESSAGE),
    options.errorToastOptions,
  );
}
