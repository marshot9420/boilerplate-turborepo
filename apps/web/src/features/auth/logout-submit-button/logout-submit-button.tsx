"use client";

import { useFormStatus } from "react-dom";

import { Button, Spinner, type ButtonProps } from "@repo/design-system/web";

export interface LogoutSubmitButtonProps extends Omit<
  ButtonProps,
  "children" | "disabled" | "type"
> {
  label?: string;
  pendingLabel?: string;
}

export default function LogoutSubmitButton({
  label = "로그아웃",
  pendingLabel = "로그아웃 중",
  variant = "ghost",
  size = "sm",
  className,
  ...props
}: LogoutSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={pending}
      aria-label={pending ? pendingLabel : label}
      className={className}
      {...props}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Spinner variant="muted" className="size-4" aria-hidden="true" />
          {pendingLabel}
        </span>
      ) : (
        label
      )}
    </Button>
  );
}
