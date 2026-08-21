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

export interface BaseBadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

const BaseBadge = forwardRef<HTMLSpanElement, BaseBadgeProps>(
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

BaseBadge.displayName = "Badge";

const badgeClasses = cva(["shadow-sm", "tracking-tight"], {
  variants: {
    variant: {
      default: "shadow-primary/10",
      muted: "bg-muted/80",
      outline: "bg-surface shadow-none",
      destructive: "shadow-destructive/10",
    },
    size: {
      sm: "h-6 px-2.5 text-xs",
      md: "h-7 px-3 text-xs",
      lg: "h-8 px-3.5 text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export type BadgeProps = BaseBadgeProps;

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <BaseBadge
        ref={ref}
        variant={variant}
        size={size}
        className={cn(badgeClasses({ variant, size }), className)}
        {...props}
        data-ds-component="badge"
      />
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
