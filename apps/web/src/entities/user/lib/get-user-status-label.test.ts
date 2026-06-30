import { describe, expect, it } from "vitest";

import { getUserStatusLabel } from "./get-user-status-label";

describe("getUserStatusLabel", () => {
  it("ACTIVE 상태 라벨을 반환한다", () => {
    expect(getUserStatusLabel("ACTIVE")).toBe("활성");
  });

  it("SUSPENDED 상태 라벨을 반환한다", () => {
    expect(getUserStatusLabel("SUSPENDED")).toBe("정지");
  });

  it("BANNED 상태 라벨을 반환한다", () => {
    expect(getUserStatusLabel("BANNED")).toBe("차단");
  });

  it("DELETED 상태 라벨을 반환한다", () => {
    expect(getUserStatusLabel("DELETED")).toBe("탈퇴");
  });
});
