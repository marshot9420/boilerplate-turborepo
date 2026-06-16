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
  hasError?: boolean;
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
