import type { ReactNode } from "react";

import { Button } from "@repo/design-system/admin";

import { URLS } from "@/constants";

export interface LogoutButtonProps {
  children?: ReactNode;
  className?: string;
  buttonClassName?: string;
}

export default function LogoutButton({
  children = "로그아웃",
  className,
  buttonClassName,
}: LogoutButtonProps) {
  return (
    <form action={URLS.API.AUTH.LOGOUT} method="post" className={className}>
      <Button type="submit" variant="ghost" size="sm" className={buttonClassName}>
        {children}
      </Button>
    </form>
  );
}
