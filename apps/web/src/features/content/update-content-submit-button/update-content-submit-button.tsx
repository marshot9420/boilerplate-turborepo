"use client";

import { useFormStatus } from "react-dom";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@repo/design-system/web";

export interface UpdateContentSubmitButtonProps extends Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "type"
> {
  pendingChildren?: ReactNode;
}

export default function UpdateContentSubmitButton({
  children = "콘텐츠 수정",
  pendingChildren = "수정 중...",
  disabled,
  ...props
}: UpdateContentSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending ? pendingChildren : children}
    </Button>
  );
}
