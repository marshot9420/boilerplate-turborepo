import type { ActionResult } from "@repo/core/action";

export type FormActionResult<TData = unknown> =
  | ActionResult<TData>
  | null
  | undefined;
