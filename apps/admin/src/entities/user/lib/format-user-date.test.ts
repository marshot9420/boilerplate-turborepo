import { describe, expect, it } from "vitest";

import { formatUserDate } from "./format-user-date";

const userDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

describe("formatUserDate", () => {
  it("ISO 날짜 문자열을 관리자 화면용 날짜로 변환한다", () => {
    const value = "2026-01-01T00:00:00.000Z";

    expect(formatUserDate(value)).toBe(userDateFormatter.format(new Date(value)));
  });

  it("null이면 없음 문구를 반환한다", () => {
    expect(formatUserDate(null)).toBe("없음");
  });

  it("유효하지 않은 날짜 문자열이면 잘못된 날짜 문구를 반환한다", () => {
    expect(formatUserDate("invalid-date")).toBe("잘못된 날짜");
  });
});
