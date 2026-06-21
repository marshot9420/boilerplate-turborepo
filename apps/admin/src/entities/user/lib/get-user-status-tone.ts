import { type UserStatusValue } from "./get-user-status-label";

export type UserStatusTone = "success" | "warning" | "danger" | "muted";

const USER_STATUS_TONES = {
  ACTIVE: "success",
  SUSPENDED: "warning",
  BANNED: "danger",
  DELETED: "muted",
} satisfies Record<UserStatusValue, UserStatusTone>;

export function getUserStatusTone(status: UserStatusValue) {
  return USER_STATUS_TONES[status];
}
