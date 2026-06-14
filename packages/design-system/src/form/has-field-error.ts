import type { FormActionResult } from "./form-action-result";
import { getFieldError } from "./get-field-error";

export function hasFieldError(
  result: FormActionResult,
  field: string,
): boolean {
  return getFieldError(result, field) !== undefined;
}
