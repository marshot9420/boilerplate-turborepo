import { describe, expect, it } from "vitest";

import { getContentStatusLabel } from "./get-content-status-label";

describe("getContentStatusLabel", () => {
  it("콘텐츠 상태 라벨을 반환한다", () => {
    expect(getContentStatusLabel("PUBLISHED")).toBe("공개");
    expect(getContentStatusLabel("HIDDEN")).toBe("숨김");
    expect(getContentStatusLabel("DELETED")).toBe("삭제됨");
  });
});
