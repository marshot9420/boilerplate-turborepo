import { describe, expect, it } from "vitest";

import {
  formBooleanSchema,
  nullableStringSchema,
  optionalBooleanSchema,
  optionalDateSchema,
  optionalEnumSchema,
  optionalIntegerSchema,
  optionalNumberSchema,
  optionalStringSchema,
  requiredStringSchema,
} from "./schema";

describe("requiredStringSchema", () => {
  it("trims and returns a required string", () => {
    expect(requiredStringSchema().parse("  value  ")).toBe("value");
  });

  it("rejects a blank string", () => {
    expect(requiredStringSchema().safeParse("   ").success).toBe(false);
  });

  it("uses a custom required message", () => {
    const result = requiredStringSchema("값을 입력해 주세요.").safeParse("");

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("값을 입력해 주세요.");
    }
  });
});

describe("optionalStringSchema", () => {
  it("normalizes a blank string to undefined", () => {
    expect(optionalStringSchema().parse("")).toBeUndefined();
  });

  it("trims and returns a string", () => {
    expect(optionalStringSchema().parse("  value  ")).toBe("value");
  });
});

describe("nullableStringSchema", () => {
  it("normalizes a blank string to null", () => {
    expect(nullableStringSchema().parse("")).toBeNull();
  });

  it("accepts undefined", () => {
    expect(nullableStringSchema().parse(undefined)).toBeUndefined();
  });
});

describe("optionalNumberSchema", () => {
  it("converts a numeric string to a number", () => {
    expect(optionalNumberSchema().parse("42")).toBe(42);
  });

  it("normalizes a blank string to undefined", () => {
    expect(optionalNumberSchema().parse("")).toBeUndefined();
  });

  it("rejects an invalid number", () => {
    expect(optionalNumberSchema().safeParse("invalid").success).toBe(false);
  });
});

describe("optionalIntegerSchema", () => {
  it("converts an integer string to an integer", () => {
    expect(optionalIntegerSchema().parse("42")).toBe(42);
  });

  it("rejects a decimal number", () => {
    expect(optionalIntegerSchema().safeParse("42.5").success).toBe(false);
  });
});

describe("optionalBooleanSchema", () => {
  it.each([
    ["true", true],
    ["1", true],
    ["on", true],
    ["yes", true],
    ["false", false],
    ["0", false],
    ["off", false],
    ["no", false],
  ] as const)("normalizes %s to %s", (input, expected) => {
    expect(optionalBooleanSchema().parse(input)).toBe(expected);
  });

  it("normalizes a blank string to undefined", () => {
    expect(optionalBooleanSchema().parse("")).toBeUndefined();
  });

  it("rejects an unrecognized boolean string", () => {
    expect(optionalBooleanSchema().safeParse("invalid").success).toBe(false);
  });
});

describe("optionalDateSchema", () => {
  it("converts a date string to a Date", () => {
    expect(optionalDateSchema().parse("2026-08-20T00:00:00.000Z")).toEqual(
      new Date("2026-08-20T00:00:00.000Z"),
    );
  });

  it("normalizes a blank string to undefined", () => {
    expect(optionalDateSchema().parse("")).toBeUndefined();
  });

  it("rejects an invalid date", () => {
    expect(optionalDateSchema().safeParse("invalid").success).toBe(false);
  });
});

describe("optionalEnumSchema", () => {
  const schema = optionalEnumSchema(["ACTIVE", "INACTIVE"] as const);

  it("accepts an allowed value", () => {
    expect(schema.parse("ACTIVE")).toBe("ACTIVE");
  });

  it("normalizes a blank string to undefined", () => {
    expect(schema.parse("")).toBeUndefined();
  });

  it("rejects an unsupported value", () => {
    expect(schema.safeParse("UNKNOWN").success).toBe(false);
  });
});

describe("formBooleanSchema", () => {
  it("normalizes a checked form value to true", () => {
    expect(formBooleanSchema().parse("on")).toBe(true);
  });

  it("normalizes a missing value to false", () => {
    expect(formBooleanSchema().parse(undefined)).toBe(false);
  });

  it("preserves the current behavior for an unrecognized value", () => {
    expect(formBooleanSchema().parse("invalid")).toBe(false);
  });
});
