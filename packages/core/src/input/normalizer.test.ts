import { describe, expect, it } from "vitest";

import {
  normalizeBlankStringToNull,
  normalizeBlankStringToUndefined,
  normalizeFormBooleanInput,
  normalizeNullableStringInput,
  normalizeOptionalBooleanInput,
  normalizeOptionalDateInput,
  normalizeOptionalIntInput,
  normalizeOptionalNumberInput,
  normalizeOptionalStringInput,
  normalizeSingleValue,
} from "./normalizer";

describe("normalizeSingleValue", () => {
  it("returns the first value from an array", () => {
    expect(normalizeSingleValue(["first", "second"])).toBe("first");
  });

  it("returns a non-array value unchanged", () => {
    expect(normalizeSingleValue("value")).toBe("value");
  });
});

describe("normalizeBlankStringToUndefined", () => {
  it("trims a non-empty string", () => {
    expect(normalizeBlankStringToUndefined("  value  ")).toBe("value");
  });

  it("normalizes a blank string to undefined", () => {
    expect(normalizeBlankStringToUndefined("   ")).toBeUndefined();
  });

  it("returns a non-string value unchanged", () => {
    expect(normalizeBlankStringToUndefined(10)).toBe(10);
  });
});

describe("normalizeBlankStringToNull", () => {
  it("trims a non-empty string", () => {
    expect(normalizeBlankStringToNull("  value  ")).toBe("value");
  });

  it("normalizes a blank string to null", () => {
    expect(normalizeBlankStringToNull("   ")).toBeNull();
  });

  it("keeps null unchanged", () => {
    expect(normalizeBlankStringToNull(null)).toBeNull();
  });
});

describe("normalizeOptionalStringInput", () => {
  it("normalizes a blank string to undefined", () => {
    expect(normalizeOptionalStringInput("")).toBeUndefined();
  });

  it("trims a string", () => {
    expect(normalizeOptionalStringInput("  value  ")).toBe("value");
  });
});

describe("normalizeNullableStringInput", () => {
  it("normalizes a blank string to null", () => {
    expect(normalizeNullableStringInput("")).toBeNull();
  });
});

describe("normalizeOptionalNumberInput", () => {
  it("converts a numeric string to a number", () => {
    expect(normalizeOptionalNumberInput("42")).toBe(42);
  });

  it("normalizes a blank string to undefined", () => {
    expect(normalizeOptionalNumberInput("")).toBeUndefined();
  });

  it("converts an invalid numeric string to NaN", () => {
    expect(normalizeOptionalNumberInput("invalid")).toBeNaN();
  });
});

describe("normalizeOptionalIntInput", () => {
  it("uses the same numeric normalization as optional number input", () => {
    expect(normalizeOptionalIntInput("42")).toBe(42);
  });
});

describe("normalizeOptionalBooleanInput", () => {
  it.each(["true", "1", "on", "yes"])("normalizes %s to true", (value) => {
    expect(normalizeOptionalBooleanInput(value)).toBe(true);
  });

  it.each(["false", "0", "off", "no"])("normalizes %s to false", (value) => {
    expect(normalizeOptionalBooleanInput(value)).toBe(false);
  });

  it("normalizes a blank string to undefined", () => {
    expect(normalizeOptionalBooleanInput("")).toBeUndefined();
  });

  it("keeps an unrecognized string unchanged", () => {
    expect(normalizeOptionalBooleanInput("invalid")).toBe("invalid");
  });

  it("keeps a boolean unchanged", () => {
    expect(normalizeOptionalBooleanInput(true)).toBe(true);
    expect(normalizeOptionalBooleanInput(false)).toBe(false);
  });
});

describe("normalizeFormBooleanInput", () => {
  it("returns true for a truthy form value", () => {
    expect(normalizeFormBooleanInput("on")).toBe(true);
  });

  it("returns false for a falsy form value", () => {
    expect(normalizeFormBooleanInput("false")).toBe(false);
  });

  it("returns false when the value is missing", () => {
    expect(normalizeFormBooleanInput(undefined)).toBe(false);
  });

  it("returns false for an unrecognized value", () => {
    expect(normalizeFormBooleanInput("invalid")).toBe(false);
  });
});

describe("normalizeOptionalDateInput", () => {
  it("converts a date string to a Date", () => {
    expect(normalizeOptionalDateInput("2026-08-20T00:00:00.000Z")).toEqual(
      new Date("2026-08-20T00:00:00.000Z"),
    );
  });

  it("keeps an existing Date unchanged", () => {
    const date = new Date("2026-08-20T00:00:00.000Z");

    expect(normalizeOptionalDateInput(date)).toBe(date);
  });

  it("normalizes a blank string to undefined", () => {
    expect(normalizeOptionalDateInput("")).toBeUndefined();
  });
});
