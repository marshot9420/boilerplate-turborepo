import { describe, expect, it } from "vitest";

import { getUserRoleLabel } from "./get-user-role-label";

describe("getUserRoleLabel", () => {
  it("일반 사용자 권한 라벨을 반환한다", () => {
    expect(getUserRoleLabel("USER")).toBe("일반 사용자");
  });

  it("관리자 권한 라벨을 반환한다", () => {
    expect(getUserRoleLabel("ADMIN")).toBe("관리자");
  });
});
