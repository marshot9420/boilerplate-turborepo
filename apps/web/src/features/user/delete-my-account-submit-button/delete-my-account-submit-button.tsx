"use client";

import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "@repo/design-system/web";

export interface DeleteMyAccountSubmitButtonProps extends Omit<
  ButtonProps,
  "children" | "type" | "variant"
> {
  disabled?: boolean;
}

export default function DeleteMyAccountSubmitButton({
  disabled = false,
  ...props
}: DeleteMyAccountSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={pending || disabled}
      aria-disabled={pending || disabled}
      {...props}
    >
      {pending ? "탈퇴 처리 중..." : "회원 탈퇴"}
    </Button>
  );
}
