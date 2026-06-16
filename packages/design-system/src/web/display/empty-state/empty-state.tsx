"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef } from "react";

import {
  EmptyState as PrimitiveEmptyState,
  type EmptyStateProps as PrimitiveEmptyStateProps,
} from "../../../primitives/display/empty-state";
import { cn } from "../../../utils";

const emptyStateVariants = cva(["rounded-xl"], {
  variants: {
    variant: {
      default: "bg-background",
      muted: "bg-muted/50 border-transparent",
      surface: "bg-surface",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface EmptyStateProps
  extends PrimitiveEmptyStateProps, VariantProps<typeof emptyStateVariants> {}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <PrimitiveEmptyState
        ref={ref}
        data-variant={variant ?? "default"}
        className={cn(emptyStateVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

EmptyState.displayName = "EmptyState";

export default EmptyState;
