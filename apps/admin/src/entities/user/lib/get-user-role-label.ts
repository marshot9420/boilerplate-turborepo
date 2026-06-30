import type { UserListItemResponse } from "@repo/domain/user/client";

export type UserRoleValue = UserListItemResponse["role"];

const USER_ROLE_LABELS = {
  USER: "일반 사용자",
  ADMIN: "관리자",
} satisfies Record<UserRoleValue, string>;

export function getUserRoleLabel(role: UserRoleValue) {
  return USER_ROLE_LABELS[role];
}
