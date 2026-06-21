import type { UserListItemResponse } from "@repo/domain/user/client";

export type UserStatusValue = UserListItemResponse["status"];

const USER_STATUS_LABELS = {
  ACTIVE: "활성",
  SUSPENDED: "정지",
  BANNED: "차단",
  DELETED: "삭제",
} satisfies Record<UserStatusValue, string>;

export function getUserStatusLabel(status: UserStatusValue) {
  return USER_STATUS_LABELS[status];
}
