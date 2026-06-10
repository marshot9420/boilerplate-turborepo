import type { FieldErrors } from "../errors";

export type ActionResult<T = null> =
  | {
      ok: true;
      data: T;
      message?: string;
    }
  | {
      ok: false;
      code: string;
      message: string;
      fieldErrors?: FieldErrors;
    };
