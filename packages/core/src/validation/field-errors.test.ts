import { describe, expect, it } from "vitest";
import { z } from "zod";

import { mapZodErrorToFieldErrors } from "./field-errors";

describe("mapZodErrorToFieldErrors", () => {
  it("maps Zod issues to field errors", () => {
    const schema = z.object({
      email: z.string().email("올바른 이메일을 입력해 주세요."),
    });

    const result = schema.safeParse({
      email: "invalid",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(mapZodErrorToFieldErrors(result.error)).toEqual({
      email: ["올바른 이메일을 입력해 주세요."],
    });
  });

  it("uses dot notation for nested field paths", () => {
    const schema = z.object({
      profile: z.object({
        displayName: z.string().min(1, "이름을 입력해 주세요."),
      }),
    });

    const result = schema.safeParse({
      profile: {
        displayName: "",
      },
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(mapZodErrorToFieldErrors(result.error)).toEqual({
      "profile.displayName": ["이름을 입력해 주세요."],
    });
  });

  it("collects multiple issues for the same field", () => {
    const schema = z.object({
      code: z
        .string()
        .min(2, "두 글자 이상이어야 합니다.")
        .regex(/^[A-Z]+$/, "대문자만 사용할 수 있습니다."),
    });

    const result = schema.safeParse({
      code: "",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(mapZodErrorToFieldErrors(result.error)).toEqual({
      code: ["두 글자 이상이어야 합니다.", "대문자만 사용할 수 있습니다."],
    });
  });

  it("ignores issues without a field path", () => {
    const result = z.string().min(1, "값을 입력해 주세요.").safeParse("");

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(mapZodErrorToFieldErrors(result.error)).toEqual({});
  });
});
