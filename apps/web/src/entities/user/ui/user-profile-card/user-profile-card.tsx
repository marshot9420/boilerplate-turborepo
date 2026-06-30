import type { ReactNode } from "react";

import { Avatar, Badge, Card, Separator } from "@repo/design-system/web";
import type { BadgeProps } from "@repo/design-system/web";
import type { UserDetailResponse } from "@repo/domain/user/client";

import { getUserRoleLabel, getUserStatusLabel } from "../../lib";
import { UserInfoList } from "../user-info-list";

type UserRole = UserDetailResponse["role"];
type UserStatus = UserDetailResponse["status"];
type BadgeVariant = NonNullable<BadgeProps["variant"]>;

const USER_ROLE_BADGE_VARIANTS = {
  USER: "outline",
  ADMIN: "default",
} satisfies Record<UserRole, BadgeVariant>;

const USER_STATUS_BADGE_VARIANTS = {
  ACTIVE: "default",
  SUSPENDED: "outline",
  BANNED: "destructive",
  DELETED: "muted",
} satisfies Record<UserStatus, BadgeVariant>;

export interface UserProfileCardProps {
  user: UserDetailResponse;
  actions?: ReactNode;
  className?: string;
}

export default function UserProfileCard({ user, actions, className }: UserProfileCardProps) {
  return (
    <Card className={className}>
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar
              src={user.avatarUrl ?? undefined}
              alt={`${user.nickname} 프로필 이미지`}
              fallback={user.nickname.slice(0, 1).toUpperCase()}
              size="lg"
            />

            <div className="min-w-0">
              <h2 className="text-foreground truncate text-xl font-semibold tracking-tight">
                {user.nickname}
              </h2>

              <p className="text-muted-foreground mt-1 truncate text-sm">{user.email}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={USER_ROLE_BADGE_VARIANTS[user.role]} size="sm">
                  {getUserRoleLabel(user.role)}
                </Badge>

                <Badge variant={USER_STATUS_BADGE_VARIANTS[user.status]} size="sm">
                  {getUserStatusLabel(user.status)}
                </Badge>
              </div>
            </div>
          </div>

          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>

        <Separator spacing="none" />

        <UserInfoList user={user} className="border-0 p-0 shadow-none" />
      </div>
    </Card>
  );
}
