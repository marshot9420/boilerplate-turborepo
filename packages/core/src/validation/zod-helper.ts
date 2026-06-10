import { z } from "zod";

export function zRequiredString(message = "필수 입력값입니다.") {
  return z.string().trim().min(1, message);
}

export function zOptionalString() {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();

    return trimmed.length === 0 ? undefined : trimmed;
  }, z.string().optional());
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
    if (value === "") {
      return undefined;
    }

    return Number(value);
  }, z.number().optional());
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
