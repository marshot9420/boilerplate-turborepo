import { describe, expect, it } from "vitest";

import { resolveErrorMessage } from "./error-message";

describe("resolveErrorMessage", () => {
  it("resolves the message from an Error", () => {
    expect(resolveErrorMessage(new Error("Something failed."))).toBe("Something failed.");
  });

  it("resolves a string error", () => {
    expect(resolveErrorMessage("Something failed.")).toBe("Something failed.");
  });

  it("ignores a blank error message", () => {
    expect(resolveErrorMessage(new Error("   "), "Fallback")).toBe("Fallback");
  });

  it("returns the fallback for an unknown value", () => {
    expect(resolveErrorMessage({ code: "UNKNOWN" }, "Fallback")).toBe("Fallback");
  });

  it("uses the default fallback when one is not provided", () => {
    expect(resolveErrorMessage(null)).toBe("알 수 없는 오류가 발생했습니다.");
  });
});
