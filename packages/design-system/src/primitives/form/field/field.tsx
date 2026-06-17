"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

const fieldVariants = cva("grid gap-2", {
  variants: {
    direction: {
      vertical: "grid-cols-1",
      horizontal: "grid-cols-1 sm:grid-cols-[12rem_1fr] sm:items-start",
    },

    fullWidth: {
      true: "w-full",
    },
  },

  defaultVariants: {
    direction: "vertical",
  },
});

export interface FieldProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof fieldVariants> {
  /**
   * Field의 invalid 상태를 표시한다.
   *
   * 이 값은 wrapper의 `data-invalid` 상태와 스타일 제어를 위한 값이며,
   * 내부 form control의 `aria-invalid`를 자동으로 설정하지 않는다.
   * 실제 input, textarea, select에는 직접 `aria-invalid`를 전달해야 한다.
   */
  hasError?: boolean;

  /**
   * Field의 disabled 상태를 표시한다.
   *
   * 이 값은 wrapper의 `data-disabled` 상태와 스타일 제어를 위한 값이며,
   * 내부 form control을 자동으로 disabled 처리하지 않는다.
   * 실제 input, textarea, select에는 직접 `disabled`를 전달해야 한다.
   */
  disabled?: boolean;
}

const Field = forwardRef<HTMLDivElement, FieldProps>(
  ({ className, direction, fullWidth, hasError = false, disabled = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-direction={direction ?? "vertical"}
        data-full-width={fullWidth ? "true" : "false"}
        data-invalid={hasError ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        className={cn(fieldVariants({ direction, fullWidth }), className)}
        {...props}
      />
    );
  },
);

Field.displayName = "Field";

export default Field;
