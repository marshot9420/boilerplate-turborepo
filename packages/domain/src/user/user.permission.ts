import type { UserRole, UserStatus } from "@prisma/client";

export interface UserPermissionActor {
  id: string;
  role: UserRole;
  status: UserStatus;
}

export function canReadUser(actor: UserPermissionActor, targetUserId: string) {
  return actor.role === "ADMIN" || actor.id === targetUserId;
}

export function canUpdateUser(actor: UserPermissionActor, targetUserId: string) {
  if (actor.status !== "ACTIVE") {
    return false;
  }

  return actor.role === "ADMIN" || actor.id === targetUserId;
}

export function canManageUsers(actor: UserPermissionActor) {
  return actor.role === "ADMIN" && actor.status === "ACTIVE";
}

export interface UserAuthenticationTarget {
  status: UserStatus;
  deletedAt?: Date | null;
}

export function canAuthenticateUser(target: UserAuthenticationTarget) {
  return target.status === "ACTIVE" && !target.deletedAt;
}
