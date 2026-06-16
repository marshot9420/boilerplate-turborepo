"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

const spinnerVariants = cva(
  [
    "inline-block animate-spin rounded-full",
    "border-2 border-muted border-t-primary",
  ],
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface SpinnerProps
  extends
    HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
  decorative?: boolean;
}

const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      className,
      size,
      label = "로딩 중",
      decorative = false,
      role,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        role={decorative ? undefined : (role ?? "status")}
        aria-label={decorative ? undefined : (ariaLabel ?? label)}
        aria-hidden={decorative ? true : undefined}
        data-size={size ?? "md"}
        data-decorative={decorative ? "true" : "false"}
        className={cn(spinnerVariants({ size }), className)}
        {...props}
      />
    );
  },
);

Spinner.displayName = "Spinner";

export default Spinner;
