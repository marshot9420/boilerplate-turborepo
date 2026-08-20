import type { FieldErrors } from "@repo/core/errors";

import type { FormActionResult } from "./form-action-result.types";

export function getFieldError(result: FormActionResult, field: string): string | undefined {
  if (!result || result.ok) {
    return undefined;
  }

  const [fieldError] = result.fieldErrors?.[field] ?? [];

  return fieldError;
}

export function getFormError(result: FormActionResult): string | undefined {
  if (!result || result.ok) {
    return undefined;
  }

  return result.message;
}

export function hasFieldErrors(fieldErrors: FieldErrors): boolean {
  return Object.values(fieldErrors).some((messages) => messages.length > 0);
}

export function hasAnyFieldError(result: FormActionResult): boolean {
  if (!result || result.ok || !result.fieldErrors) {
    return false;
  }

  return hasFieldErrors(result.fieldErrors);
}

export interface ResolveFieldErrorParams {
  clientError?: string;
  serverError?: string;
  touched: boolean;
  submitAttempted: boolean;
  editedAfterResult: boolean;
}

export function resolveFieldError({
  clientError,
  serverError,
  touched,
  submitAttempted,
  editedAfterResult,
}: ResolveFieldErrorParams): string | undefined {
  if ((touched || submitAttempted) && clientError !== undefined) {
    return clientError;
  }

  if (editedAfterResult) {
    return undefined;
  }

  return serverError;
}
