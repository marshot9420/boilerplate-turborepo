import { z } from "zod";

import {
  normalizeBlankStringToUndefined,
  normalizeFormBooleanInput,
  normalizeNullableStringInput,
  normalizeOptionalBooleanInput,
  normalizeOptionalDateInput,
  normalizeOptionalIntInput,
  normalizeOptionalNumberInput,
  normalizeOptionalStringInput,
} from "../normalize";

export function zRequiredString(message = "필수 입력값입니다.") {
  return z.string().trim().min(1, message);
}

export function zOptionalString() {
  return z.preprocess(normalizeOptionalStringInput, z.string().optional());
}

export function zNullableString() {
  return z.preprocess(normalizeNullableStringInput, z.string().nullable().optional());
}

export function zOptionalNumber() {
  return z.preprocess(normalizeOptionalNumberInput, z.number().optional());
}

export function zOptionalInt() {
  return z.preprocess(normalizeOptionalIntInput, z.number().int().optional());
}

export function zOptionalBoolean() {
  return z.preprocess(normalizeOptionalBooleanInput, z.boolean().optional());
}

export function zOptionalDate() {
  return z.preprocess(normalizeOptionalDateInput, z.date().optional());
}

export function zOptionalEnum<TValues extends readonly [string, ...string[]]>(values: TValues) {
  return z.preprocess(normalizeBlankStringToUndefined, z.enum(values).optional());
}

export function zFormBoolean() {
  return z.preprocess(normalizeFormBooleanInput, z.boolean());
}
