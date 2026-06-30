import { describe, expect, it } from "vitest";

import { formatContentDate } from "./format-content-date";

describe("formatContentDate", () => {
  it("콘텐츠 날짜를 한국어 날짜/시간 형식으로 변환한다", () => {
    const value = "2026-06-20T00:00:00.000Z";
    const expected = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));

    expect(formatContentDate(value)).toBe(expected);
  });
});
