"use client";

import { toast } from "sonner";

import type { ActionResult } from "@repo/core/action";

export const DEFAULT_TOAST_SUCCESS_MESSAGE = "처리되었습니다.";
export const DEFAULT_TOAST_ERROR_MESSAGE = "요청 처리에 실패했습니다.";

export interface ToastActionResultOptions {
  successMessage?: string;
  errorMessage?: string;
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
      result.message || options.successMessage || DEFAULT_TOAST_SUCCESS_MESSAGE,
    );

    return;
  }

  toast.error(
    result.message || options.errorMessage || DEFAULT_TOAST_ERROR_MESSAGE,
  );
}
