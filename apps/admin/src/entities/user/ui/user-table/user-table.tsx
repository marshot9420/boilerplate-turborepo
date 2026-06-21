import {
  Avatar,
  LinkButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/admin";
import type { UserListItemResponse } from "@repo/domain/user/client";

import { formatUserDate } from "../../lib";
import { UserRoleBadge } from "../user-role-badge";
import { UserStatusBadge } from "../user-status-badge";

export interface UserTableProps {
  users: UserListItemResponse[];
  getUserHref?: (userId: string) => string;
}

function getUserDisplayName(user: UserListItemResponse) {
  return user.name?.trim() || user.nickname;
}

function getUserAvatarFallback(user: UserListItemResponse) {
  return getUserDisplayName(user).slice(0, 1).toUpperCase();
}

export default function UserTable({ users, getUserHref }: UserTableProps) {
  const hasDetailLink = Boolean(getUserHref);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>사용자</TableHead>
          <TableHead>닉네임</TableHead>
          <TableHead>권한</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>가입일</TableHead>
          <TableHead>최근 로그인</TableHead>
          {hasDetailLink ? <TableHead className="text-right">관리</TableHead> : null}
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex min-w-56 items-center gap-3">
                <Avatar
                  src={user.avatarUrl ?? undefined}
                  alt={`${getUserDisplayName(user)} 프로필 이미지`}
                  fallback={getUserAvatarFallback(user)}
                  size="sm"
                />

                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-medium">
                    {getUserDisplayName(user)}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-foreground text-sm">{user.nickname}</span>
            </TableCell>

            <TableCell>
              <UserRoleBadge role={user.role} />
            </TableCell>

            <TableCell>
              <UserStatusBadge status={user.status} />
            </TableCell>

            <TableCell>
              <span className="text-muted-foreground text-sm whitespace-nowrap">
                {formatUserDate(user.createdAt)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-muted-foreground text-sm whitespace-nowrap">
                {formatUserDate(user.lastLoginAt)}
              </span>
            </TableCell>

            {hasDetailLink ? (
              <TableCell className="text-right">
                <LinkButton href={getUserHref?.(user.id) ?? "#"} variant="outline" size="sm">
                  상세
                </LinkButton>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
