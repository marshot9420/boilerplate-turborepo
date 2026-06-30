import { describe, expect, it } from "vitest";

import { getContentStatusTone } from "./get-content-status-tone";

describe("getContentStatusTone", () => {
  it("콘텐츠 상태에 대응되는 badge tone을 반환한다", () => {
    expect(getContentStatusTone("PUBLISHED")).toBe("default");
    expect(getContentStatusTone("HIDDEN")).toBe("outline");
    expect(getContentStatusTone("DELETED")).toBe("destructive");
  });
});
