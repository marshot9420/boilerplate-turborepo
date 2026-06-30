import type { UserRole, UserStatus } from "@prisma/client";

import type { PaginationMeta } from "@repo/core/pagination";

export interface UserDetailResponse {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  nickname: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  deletedAt: string | null;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  nickname: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface UserListItemResponse {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  nickname: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface UserListResponse {
  items: UserListItemResponse[];
  meta: PaginationMeta;
}
