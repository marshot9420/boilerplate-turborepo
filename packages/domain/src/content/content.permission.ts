import type { UserRole, UserStatus } from "@prisma/client";

export interface ContentPermissionActor {
  id: string;
  role: UserRole;
  status: UserStatus;
}

export function canCreateContent(actor: ContentPermissionActor) {
  return actor.status === "ACTIVE";
}

export function canReadContent(
  actor: ContentPermissionActor | null,
  content: {
    authorId: string;
    status: "PUBLISHED" | "HIDDEN" | "DELETED";
  },
) {
  if (content.status === "PUBLISHED") {
    return true;
  }

  if (!actor) {
    return false;
  }

  return actor.role === "ADMIN" || actor.id === content.authorId;
}

export function canUpdateContent(
  actor: ContentPermissionActor,
  content: {
    authorId: string;
  },
) {
  if (actor.status !== "ACTIVE") {
    return false;
  }

  return actor.role === "ADMIN" || actor.id === content.authorId;
}

export function canDeleteContent(
  actor: ContentPermissionActor,
  content: {
    authorId: string;
  },
) {
  if (actor.status !== "ACTIVE") {
    return false;
  }

  return actor.role === "ADMIN" || actor.id === content.authorId;
}
