"use client";

import { cva } from "class-variance-authority";

import { forwardRef } from "react";

import {
  Badge as PrimitiveBadge,
  type BadgeProps as PrimitiveBadgeProps,
} from "../../../primitives/display/badge";
import { cn } from "../../../utils";

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

export type BadgeProps = PrimitiveBadgeProps;

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <PrimitiveBadge
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
