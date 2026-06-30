import { describe, expect, it } from "vitest";

import { formatUserDate } from "./format-user-date";

describe("formatUserDate", () => {
  it("날짜 문자열을 한국어 날짜 형식으로 변환한다", () => {
    const value = "2026-01-01T00:00:00.000Z";
    const expected = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));

    expect(formatUserDate(value)).toBe(expected);
  });

  it("null이면 없음으로 반환한다", () => {
    expect(formatUserDate(null)).toBe("없음");
  });
});
