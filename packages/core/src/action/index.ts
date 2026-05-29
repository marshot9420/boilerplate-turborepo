export type ActionFieldErrors = Record<string, string[]>;

export type ActionResult<TData = void> =
  | {
      ok: true;
      data: TData;
      message?: string;
    }
  | {
      ok: false;
      code: string;
      message: string;
      fieldErrors?: ActionFieldErrors;
    };

export function actionSuccess<TData>(
  data: TData,
  message?: string,
): ActionResult<TData> {
  return {
    ok: true,
    data,
    message,
  };
}

export function actionFailure(params: {
  code: string;
  message: string;
  fieldErrors?: ActionFieldErrors;
}): ActionResult<never> {
  return {
    ok: false,
    code: params.code,
    message: params.message,
    fieldErrors: params.fieldErrors,
  };
}
