import { describe, expect, it } from "vitest";

import type { UserListItemResponse } from "@repo/domain/user/client";

import { getUserStatusLabel } from "./get-user-status-label";

const cases = [
  ["ACTIVE", "활성"],
  ["SUSPENDED", "정지"],
  ["BANNED", "차단"],
  ["DELETED", "삭제"],
] satisfies Array<[UserListItemResponse["status"], string]>;

describe("getUserStatusLabel", () => {
  it.each(cases)("%s 상태 라벨을 반환한다", (status, label) => {
    expect(getUserStatusLabel(status)).toBe(label);
  });
});
