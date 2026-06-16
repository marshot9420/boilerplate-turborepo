"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "rounded-full border font-medium",
    "transition-colors",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-transparent",
        muted: "bg-muted text-foreground border-transparent",
        outline: "border-border bg-background text-foreground",
        destructive: "bg-destructive text-destructive-foreground border-transparent",
      },
      size: {
        sm: "h-5 px-2 text-xs",
        md: "h-6 px-2.5 text-xs",
        lg: "h-7 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-variant={variant ?? "default"}
        data-size={size ?? "md"}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
