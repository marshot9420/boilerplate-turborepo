import type { FormActionResult } from "./form-action-result";

export function getFieldError(
  result: FormActionResult,
  field: string,
): string | undefined {
  if (!result || result.ok) {
    return undefined;
  }

  const [fieldError] = result.fieldErrors?.[field] ?? [];

  return fieldError;
}
