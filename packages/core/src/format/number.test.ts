import { describe, expect, it } from "vitest";

import { formatCurrency, formatNumber, formatPercentage } from "./number";

describe("formatNumber", () => {
  it("formats a number using the default locale", () => {
    expect(formatNumber(1_234_567)).toBe("1,234,567");
  });

  it("supports custom number format options", () => {
    expect(
      formatNumber(12.345, {
        maximumFractionDigits: 2,
      }),
    ).toBe("12.35");
  });
});

describe("formatCurrency", () => {
  it("formats KRW by default", () => {
    expect(formatCurrency(15_000)).toBe("₩15,000");
  });

  it("formats negative currency values", () => {
    expect(formatCurrency(-15_000)).toBe("-₩15,000");
  });

  it("supports another locale and currency", () => {
    expect(
      formatCurrency(15.5, {
        locale: "en-US",
        currency: "USD",
      }),
    ).toBe("$15.50");
  });
});

describe("formatPercentage", () => {
  it("formats a percentage value", () => {
    expect(formatPercentage(15)).toBe("15%");
  });

  it("preserves decimal percentage values", () => {
    expect(formatPercentage(12.5)).toBe("12.5%");
  });
});
