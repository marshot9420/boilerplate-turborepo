import { describe, expect, it } from "vitest";

import { formatContentDate } from "./format-content-date";

describe("formatContentDate", () => {
  it("ISO 날짜 문자열을 한국어 날짜 형식으로 변환한다", () => {
    const result = formatContentDate("2026-06-18T12:00:00.000Z");

    expect(result).toContain("2026");
    expect(result).toContain("06");
    expect(result).toContain("18");
  });
});
