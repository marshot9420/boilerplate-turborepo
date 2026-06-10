export type FieldErrors = Record<string, string[]>;

export interface AppError {
  code: string;
  message: string;
  fieldErrors?: FieldErrors;
  cause?: unknown;
}
