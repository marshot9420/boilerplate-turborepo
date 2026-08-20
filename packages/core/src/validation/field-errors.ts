import type { z } from "zod";

import type { FieldErrors } from "../errors";

export function mapZodErrorToFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};

  for (const issue of error.issues) {
    const fieldPath = issue.path.join(".");

    if (!fieldPath) {
      continue;
    }

    fieldErrors[fieldPath] ??= [];
    fieldErrors[fieldPath].push(issue.message);
  }

  return fieldErrors;
}
