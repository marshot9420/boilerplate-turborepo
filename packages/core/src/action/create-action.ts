import type { z } from "zod";

import type { AppError } from "../errors";
import { COMMON_ERROR_CODE } from "../errors";
import { logger } from "../logger";
import type { Result } from "../result";
import { mapZodErrorToFieldErrors } from "../validation";
import type { ActionResult } from "./action-result";

export interface CreateActionParams<TInput, TData> {
  actionName: string;
  schema: z.ZodType<TInput>;
  formData: FormData;
  handler: (input: TInput) => Promise<Result<TData, AppError>>;
  successMessage?: string;
  parseFormData?: (formData: FormData) => unknown;
}

export async function createAction<TInput, TData>({
  actionName,
  schema,
  formData,
  handler,
  successMessage,
  parseFormData,
}: CreateActionParams<TInput, TData>): Promise<ActionResult<TData>> {
  try {
    const raw = parseFormData ? parseFormData(formData) : Object.fromEntries(formData.entries());

    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      return {
        ok: false,
        code: COMMON_ERROR_CODE.VALIDATION_ERROR,
        message: "입력값을 확인해 주세요.",
        fieldErrors: mapZodErrorToFieldErrors(parsed.error),
      };
    }

    const result = await handler(parsed.data);

    if (!result.ok) {
      logger.warn(`${actionName}.failed`, {
        code: result.error.code,
        message: result.error.message,
      });

      return {
        ok: false,
        code: result.error.code,
        message: result.error.message,
        fieldErrors: result.error.fieldErrors,
      };
    }

    logger.info(`${actionName}.succeeded`);

    return {
      ok: true,
      data: result.data,
      message: successMessage,
    };
  } catch (error) {
    logger.error(`${actionName}.unexpected_error`, {
      error,
    });

    return {
      ok: false,
      code: COMMON_ERROR_CODE.INTERNAL_SERVER_ERROR,
      message: "요청 처리 중 오류가 발생했습니다.",
    };
  }
}
