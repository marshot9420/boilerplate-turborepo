import { z } from "zod";

const TRUE_STRING_VALUES = new Set(["true", "1", "on", "yes"]);

const FALSE_STRING_VALUES = new Set(["false", "0", "off", "no"]);

export function normalizeSingleValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function normalizeBlankStringToUndefined(value: unknown): unknown {
  const singleValue = normalizeSingleValue(value);

  if (typeof singleValue !== "string") {
    return singleValue;
  }

  const trimmed = singleValue.trim();

  return trimmed.length === 0 ? undefined : trimmed;
}

export function normalizeBlankStringToNull(value: unknown): unknown {
  const singleValue = normalizeSingleValue(value);

  if (singleValue === null) {
    return null;
  }

  if (typeof singleValue !== "string") {
    return singleValue;
  }

  const trimmed = singleValue.trim();

  return trimmed.length === 0 ? null : trimmed;
}

export function normalizeOptionalStringInput(value: unknown): unknown {
  return normalizeBlankStringToUndefined(value);
}

export function normalizeNullableStringInput(value: unknown): unknown {
  return normalizeBlankStringToNull(value);
}

export function normalizeOptionalNumberInput(value: unknown): unknown {
  const normalized = normalizeBlankStringToUndefined(value);

  if (normalized === undefined) {
    return undefined;
  }

  return Number(normalized);
}

export function normalizeOptionalIntInput(value: unknown): unknown {
  return normalizeOptionalNumberInput(value);
}

export function normalizeOptionalBooleanInput(value: unknown): unknown {
  const normalized = normalizeBlankStringToUndefined(value);

  if (normalized === undefined) {
    return undefined;
  }

  if (typeof normalized === "boolean") {
    return normalized;
  }

  if (typeof normalized !== "string") {
    return normalized;
  }

  const lowerCased = normalized.toLowerCase();

  if (TRUE_STRING_VALUES.has(lowerCased)) {
    return true;
  }

  if (FALSE_STRING_VALUES.has(lowerCased)) {
    return false;
  }

  return normalized;
}

export function normalizeFormBooleanInput(value: unknown): boolean {
  const normalized = normalizeOptionalBooleanInput(value);

  return normalized === true;
}

export function normalizeOptionalDateInput(value: unknown): unknown {
  const normalized = normalizeBlankStringToUndefined(value);

  if (normalized === undefined) {
    return undefined;
  }

  if (normalized instanceof Date) {
    return normalized;
  }

  if (typeof normalized !== "string" && typeof normalized !== "number") {
    return normalized;
  }

  return new Date(normalized);
}

export function requiredStringSchema(message = "필수 입력값입니다.") {
  return z.string().trim().min(1, message);
}

export function optionalStringSchema() {
  return z.preprocess(normalizeOptionalStringInput, z.string().optional());
}

export function nullableStringSchema() {
  return z.preprocess(normalizeNullableStringInput, z.string().nullable().optional());
}

export function optionalNumberSchema() {
  return z.preprocess(normalizeOptionalNumberInput, z.number().optional());
}

export function optionalIntegerSchema() {
  return z.preprocess(normalizeOptionalIntInput, z.number().int().optional());
}

export function optionalBooleanSchema() {
  return z.preprocess(normalizeOptionalBooleanInput, z.boolean().optional());
}

export function optionalDateSchema() {
  return z.preprocess(normalizeOptionalDateInput, z.date().optional());
}

export function optionalEnumSchema<TValues extends readonly [string, ...string[]]>(
  values: TValues,
) {
  return z.preprocess(normalizeBlankStringToUndefined, z.enum(values).optional());
}

export function formBooleanSchema() {
  return z.preprocess(normalizeFormBooleanInput, z.boolean());
}
