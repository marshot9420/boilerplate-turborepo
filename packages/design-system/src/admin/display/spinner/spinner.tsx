"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

const baseSpinnerVariants = cva(
  ["inline-block animate-spin rounded-full", "border-muted border-t-primary border-2"],
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

export interface BaseSpinnerProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof baseSpinnerVariants> {
  label?: string;
  decorative?: boolean;
}

const BaseSpinner = forwardRef<HTMLSpanElement, BaseSpinnerProps>(
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
        className={cn(baseSpinnerVariants({ size }), className)}
        {...props}
      />
    );
  },
);

BaseSpinner.displayName = "Spinner";

const spinnerVariants = cva([], {
  variants: {
    variant: {
      default: "border-muted border-t-primary",
      muted: "border-muted/70 border-t-muted-foreground",
      inverse: "border-primary-foreground/30 border-t-primary-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface SpinnerProps extends BaseSpinnerProps, VariantProps<typeof spinnerVariants> {}

const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <BaseSpinner
        ref={ref}
        data-variant={variant ?? "default"}
        className={cn(spinnerVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

Spinner.displayName = "Spinner";

export default Spinner;
