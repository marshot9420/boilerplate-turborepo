import type { FormActionResult } from "./form-action-result";

export function getFormError(result: FormActionResult): string | undefined {
  if (!result || result.ok) {
    return undefined;
  }

  return result.message;
}
