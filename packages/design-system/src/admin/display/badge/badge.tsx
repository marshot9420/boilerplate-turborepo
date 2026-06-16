"use client";

import { cva } from "class-variance-authority";

import { forwardRef } from "react";

import {
  Badge as PrimitiveBadge,
  type BadgeProps as PrimitiveBadgeProps,
} from "../../../primitives/display/badge";
import { cn } from "../../../utils";

const badgeClasses = cva(["shadow-none", "font-semibold", "uppercase", "tracking-wide"], {
  variants: {
    variant: {
      default: "bg-primary",
      muted: "bg-muted/80",
      outline: "bg-surface",
      destructive: "bg-destructive",
    },
    size: {
      sm: "h-5 px-2 text-[0.6875rem]",
      md: "h-6 px-2.5 text-xs",
      lg: "h-7 px-3 text-xs",
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
