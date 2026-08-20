import { describe, expect, it } from "vitest";

import { formatDate, formatDateTime } from "./date";

describe("formatDate", () => {
  it("formats a date using the default Korean locale and timezone", () => {
    expect(formatDate("2026-08-20T12:30:00.000Z")).toBe("2026. 08. 20.");
  });

  it("throws when the date value is invalid", () => {
    expect(() => formatDate("invalid")).toThrow(RangeError);
  });
});

describe("formatDateTime", () => {
  it("formats a date and time using the default Korean locale and timezone", () => {
    expect(formatDateTime("2026-08-20T12:30:00.000Z")).toBe("2026. 08. 20. 21:30");
  });

  it("supports a custom timezone", () => {
    expect(
      formatDateTime("2026-08-20T12:30:00.000Z", {
        locale: "en-US",
        timeZone: "UTC",
        hourCycle: "h23",
      }),
    ).toContain("12:30");
  });
});
