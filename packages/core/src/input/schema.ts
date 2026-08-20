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
} from "./normalizer";

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
