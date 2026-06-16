"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef } from "react";

import {
  Skeleton as PrimitiveSkeleton,
  type SkeletonProps as PrimitiveSkeletonProps,
} from "../../../primitives/display/skeleton";
import { cn } from "../../../utils";

const skeletonVariants = cva([], {
  variants: {
    variant: {
      default: "bg-muted",
      subtle: "bg-muted/70",
      strong: "bg-muted-foreground/20",
    },
    animated: {
      true: "motion-reduce:animate-none",
      false: "animate-none",
    },
  },
  defaultVariants: {
    variant: "default",
    animated: true,
  },
});

export interface SkeletonProps
  extends PrimitiveSkeletonProps, VariantProps<typeof skeletonVariants> {}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, animated = true, ...props }, ref) => {
    return (
      <PrimitiveSkeleton
        ref={ref}
        data-variant={variant ?? "default"}
        data-animated={animated ? "true" : "false"}
        className={cn(skeletonVariants({ variant, animated }), className)}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

export default Skeleton;
