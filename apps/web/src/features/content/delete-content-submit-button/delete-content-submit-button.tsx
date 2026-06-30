"use client";

import { useFormStatus } from "react-dom";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@repo/design-system/web";

export interface DeleteContentSubmitButtonProps extends Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "type"
> {
  pendingChildren?: ReactNode;
}

export default function DeleteContentSubmitButton({
  children = "콘텐츠 삭제",
  pendingChildren = "삭제 중...",
  disabled,
  variant = "destructive",
  ...props
}: DeleteContentSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} disabled={pending || disabled} {...props}>
      {pending ? pendingChildren : children}
    </Button>
  );
}
