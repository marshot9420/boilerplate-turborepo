import { describe, expect, it } from "vitest";

import type { UserListItemResponse } from "@repo/domain/user/client";

import { getUserStatusTone, type UserStatusTone } from "./get-user-status-tone";

const cases = [
  ["ACTIVE", "success"],
  ["SUSPENDED", "warning"],
  ["BANNED", "danger"],
  ["DELETED", "muted"],
] satisfies Array<[UserListItemResponse["status"], UserStatusTone]>;

describe("getUserStatusTone", () => {
  it.each(cases)("%s 상태 tone을 반환한다", (status, tone) => {
    expect(getUserStatusTone(status)).toBe(tone);
  });
});
