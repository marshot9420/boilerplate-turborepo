import type { UserDetailResponse } from "@repo/domain/user/client";

type UserRole = UserDetailResponse["role"];

const USER_ROLE_LABELS = {
  USER: "사용자",
  ADMIN: "관리자",
} satisfies Record<UserRole, string>;

export function getUserRoleLabel(role: UserRole): string {
  return USER_ROLE_LABELS[role];
}
