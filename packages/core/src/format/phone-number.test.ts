import { describe, expect, it } from "vitest";

import { formatKoreanPhoneNumber } from "./phone-number";

describe("formatKoreanPhoneNumber", () => {
  it("formats a Seoul phone number", () => {
    expect(formatKoreanPhoneNumber("0212345678")).toBe("02-1234-5678");
  });

  it("formats a mobile phone number", () => {
    expect(formatKoreanPhoneNumber("01012345678")).toBe("010-1234-5678");
  });

  it("formats a phone number with a three-digit middle group", () => {
    expect(formatKoreanPhoneNumber("0101234567")).toBe("010-123-4567");
  });

  it("returns an unsupported value unchanged", () => {
    expect(formatKoreanPhoneNumber("invalid")).toBe("invalid");
  });
});
