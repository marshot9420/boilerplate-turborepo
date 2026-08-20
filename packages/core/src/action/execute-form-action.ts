import type { z } from "zod";

import type { AppError } from "../errors";
import { COMMON_ERROR_CODE } from "../errors";
import { logger } from "../logger";
import type { Result } from "../result";
import { mapZodErrorToFieldErrors } from "../validation";
import type { ActionResult } from "./action-result";

interface ExecuteFormActionParams<TInput, TData> {
  actionName: string;
  schema: z.ZodType<TInput>;
  formData: FormData;
  handler: (input: TInput) => Promise<Result<TData, AppError>>;
  successMessage?: string;
  parseFormData?: (formData: FormData) => unknown;
}

export async function executeFormAction<TInput, TData>({
  actionName,
  schema,
  formData,
  handler,
  successMessage,
  parseFormData,
}: ExecuteFormActionParams<TInput, TData>): Promise<ActionResult<TData>> {
  try {
    const rawInput = parseFormData
      ? parseFormData(formData)
      : Object.fromEntries(formData.entries());

    const parseResult = schema.safeParse(rawInput);

    if (!parseResult.success) {
      return {
        ok: false,
        code: COMMON_ERROR_CODE.VALIDATION_ERROR,
        message: "입력값을 확인해 주세요.",
        fieldErrors: mapZodErrorToFieldErrors(parseResult.error),
      };
    }

    const handlerResult = await handler(parseResult.data);

    if (!handlerResult.ok) {
      logger.warn(`${actionName}.failed`, {
        code: handlerResult.error.code,
        message: handlerResult.error.message,
      });

      return {
        ok: false,
        code: handlerResult.error.code,
        message: handlerResult.error.message,
        fieldErrors: handlerResult.error.fieldErrors,
      };
    }

    logger.info(`${actionName}.succeeded`);

    return {
      ok: true,
      data: handlerResult.data,
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
