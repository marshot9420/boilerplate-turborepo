import { z } from "zod";

function emptyStringToUndefined(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? undefined : trimmed;
}

export function zRequiredString(message = "필수 입력값입니다.") {
  return z.string().trim().min(1, message);
}

export function zOptionalString() {
  return z.preprocess(emptyStringToUndefined, z.string().optional());
}

export function zNullableString() {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();

    return trimmed.length === 0 ? null : trimmed;
  }, z.string().nullable().optional());
}

export function zOptionalNumber() {
  return z.preprocess((value) => {
    const normalized = emptyStringToUndefined(value);

    if (normalized === undefined) {
      return undefined;
    }

    return Number(normalized);
  }, z.number().optional());
}

export function zOptionalInt() {
  return z.preprocess((value) => {
    const normalized = emptyStringToUndefined(value);

    if (normalized === undefined) {
      return undefined;
    }

    return Number(normalized);
  }, z.number().int().optional());
}

export function zOptionalEnum<TValues extends readonly [string, ...string[]]>(values: TValues) {
  return z.preprocess(emptyStringToUndefined, z.enum(values).optional());
}

export function zFormBoolean() {
  return z.preprocess((value) => {
    if (value === "on") {
      return true;
    }

    if (value === "true") {
      return true;
    }

    return false;
  }, z.boolean());
}
