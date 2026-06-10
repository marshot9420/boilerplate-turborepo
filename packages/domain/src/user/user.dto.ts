import type { UserRole, UserStatus } from "@prisma/client";

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
