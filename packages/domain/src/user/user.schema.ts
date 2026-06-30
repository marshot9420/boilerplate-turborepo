import { AuthProvider, UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

import type { ListQuery } from "@repo/core/types";
import { zNullableString } from "@repo/core/validation";

import { USER } from "./user.constant";

export const UserIdParam = z.object({
  id: z.uuid(USER.ID.INVALID_MESSAGE),
});

export type UserIdParamInput = z.infer<typeof UserIdParam>;

export const UserListSortKeys = [
  "EMAIL",
  "NICKNAME",
  "ROLE",
  "STATUS",
  "CREATED_AT",
  "LAST_LOGIN_AT",
] as const;

export type UserListSortKey = (typeof UserListSortKeys)[number];

export interface UserListQuery extends ListQuery<UserListSortKey> {
  keyword?: string;
  role?: "USER" | "ADMIN";
  status?: "ACTIVE" | "SUSPENDED" | "BANNED" | "DELETED";
}

export const UserListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(100).optional(),

  keyword: z.string().trim().optional(),

  role: z.enum(UserRole).optional(),

  status: z.enum(UserStatus).optional(),

  sortKey: z.enum(UserListSortKeys).optional(),

  sortDirection: z.enum(["asc", "desc"]).optional(),
});

export type UserListQueryInput = z.infer<typeof UserListQuerySchema>;

export const UpdateUserProfileRequest = z.object({
  name: zNullableString().pipe(
    z.string().max(USER.NAME.MAX_LENGTH, USER.NAME.MAX_MESSAGE).nullable().optional(),
  ),

  avatarUrl: zNullableString().pipe(z.url(USER.AVATAR_URL.INVALID_MESSAGE).nullable().optional()),

  nickname: z
    .string()
    .trim()
    .min(USER.NICKNAME.MIN_LENGTH, USER.NICKNAME.MIN_MESSAGE)
    .max(USER.NICKNAME.MAX_LENGTH, USER.NICKNAME.MAX_MESSAGE)
    .regex(USER.NICKNAME.PATTERN, USER.NICKNAME.INVALID_MESSAGE),
});

export type UpdateUserProfileRequestInput = z.infer<typeof UpdateUserProfileRequest>;

export const OAuthProviderSchema = z.enum(AuthProvider);

export const FindOrCreateOAuthUserRequest = z.object({
  provider: OAuthProviderSchema,

  providerUserId: z.string().trim().min(1),

  email: z.email(USER.EMAIL.INVALID_MESSAGE).max(USER.EMAIL.MAX_LENGTH, USER.EMAIL.INVALID_MESSAGE),

  name: z.string().trim().max(USER.NAME.MAX_LENGTH, USER.NAME.MAX_MESSAGE).nullable(),

  avatarUrl: z.url(USER.AVATAR_URL.INVALID_MESSAGE).nullable(),
});

export type FindOrCreateOAuthUserRequestInput = z.infer<typeof FindOrCreateOAuthUserRequest>;

export const DeleteMyAccountRequest = z.object({
  confirmation: z
    .string()
    .trim()
    .refine((value) => value === "회원탈퇴", {
      message: "회원탈퇴를 입력해 주세요.",
    }),
});

export type DeleteMyAccountRequestInput = z.infer<typeof DeleteMyAccountRequest>;
