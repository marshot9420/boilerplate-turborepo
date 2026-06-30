import { describe, expect, it } from "vitest";

import { getUserRoleLabel } from "./get-user-role-label";

describe("getUserRoleLabel", () => {
  it("USER 권한 라벨을 반환한다", () => {
    expect(getUserRoleLabel("USER")).toBe("사용자");
  });

  it("ADMIN 권한 라벨을 반환한다", () => {
    expect(getUserRoleLabel("ADMIN")).toBe("관리자");
  });
});
