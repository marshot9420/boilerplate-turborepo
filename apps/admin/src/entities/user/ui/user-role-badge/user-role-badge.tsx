import type { ComponentPropsWithoutRef } from "react";

import { Badge } from "@repo/design-system/admin";
import type { UserListItemResponse } from "@repo/domain/user/client";

import { getUserRoleLabel } from "../../lib";

export interface UserRoleBadgeProps extends Omit<
  ComponentPropsWithoutRef<typeof Badge>,
  "children"
> {
  role: UserListItemResponse["role"];
}

const roleClassNames = {
  USER: "border-border bg-muted text-muted-foreground",
  ADMIN: "border-info/30 bg-info/10 text-foreground",
} satisfies Record<UserListItemResponse["role"], string>;

export default function UserRoleBadge({ role, className, ...props }: UserRoleBadgeProps) {
  return (
    <Badge
      variant="outline"
      size="sm"
      className={[roleClassNames[role], className].filter(Boolean).join(" ")}
      {...props}
    >
      {getUserRoleLabel(role)}
    </Badge>
  );
}
