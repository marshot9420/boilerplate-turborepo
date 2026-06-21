import type { ComponentPropsWithoutRef } from "react";

import { Badge } from "@repo/design-system/admin";
import type { UserListItemResponse } from "@repo/domain/user/client";

import { getUserStatusLabel, getUserStatusTone, type UserStatusTone } from "../../lib";

export interface UserStatusBadgeProps extends Omit<
  ComponentPropsWithoutRef<typeof Badge>,
  "children"
> {
  status: UserListItemResponse["status"];
}

const statusToneClassNames = {
  success: "border-success/30 bg-success/10 text-foreground",
  warning: "border-warning/40 bg-warning/10 text-foreground",
  danger: "border-destructive/40 bg-destructive/10 text-destructive",
  muted: "border-border bg-muted text-muted-foreground",
} satisfies Record<UserStatusTone, string>;

export default function UserStatusBadge({ status, className, ...props }: UserStatusBadgeProps) {
  const tone = getUserStatusTone(status);

  return (
    <Badge
      variant="outline"
      size="sm"
      className={[statusToneClassNames[tone], className].filter(Boolean).join(" ")}
      {...props}
    >
      {getUserStatusLabel(status)}
    </Badge>
  );
}
