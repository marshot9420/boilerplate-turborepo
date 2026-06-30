"use client";

import { useFormStatus } from "react-dom";

import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@repo/design-system/web";

export interface UpdateMyProfileSubmitButtonProps extends Omit<ButtonProps, "children" | "type"> {
  children?: ReactNode;
  pendingText?: ReactNode;
}

export default function UpdateMyProfileSubmitButton({
  children = "프로필 수정",
  pendingText = "수정 중...",
  disabled,
  ...props
}: UpdateMyProfileSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}
