"use client";

import { useFormStatus } from "react-dom";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@repo/design-system/web";

export interface CreateContentSubmitButtonProps extends Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "type"
> {
  pendingChildren?: ReactNode;
}

export default function CreateContentSubmitButton({
  children = "콘텐츠 생성",
  pendingChildren = "생성 중...",
  disabled,
  ...props
}: CreateContentSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending ? pendingChildren : children}
    </Button>
  );
}
