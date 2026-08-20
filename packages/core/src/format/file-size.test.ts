import { describe, expect, it } from "vitest";

import { formatFileSize } from "./file-size";

describe("formatFileSize", () => {
  it("formats zero bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1 KB");
  });

  it("formats fractional units", () => {
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(10 * 1024 * 1024)).toBe("10 MB");
  });

  it("rejects negative values", () => {
    expect(() => formatFileSize(-1)).toThrow(RangeError);
  });
});
