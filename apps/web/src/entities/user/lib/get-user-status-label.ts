import type { UserDetailResponse } from "@repo/domain/user/client";

type UserStatus = UserDetailResponse["status"];

const USER_STATUS_LABELS = {
  ACTIVE: "활성",
  SUSPENDED: "정지",
  BANNED: "차단",
  DELETED: "탈퇴",
} satisfies Record<UserStatus, string>;

export function getUserStatusLabel(status: UserStatus): string {
  return USER_STATUS_LABELS[status];
}
