"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

const baseSkeletonVariants = cva("bg-muted animate-pulse", {
  variants: {
    shape: {
      rectangle: "rounded-md",
      circle: "rounded-full",
      text: "h-4 rounded-md",
    },
  },
  defaultVariants: {
    shape: "rectangle",
  },
});

export interface BaseSkeletonProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof baseSkeletonVariants> {}

const BaseSkeleton = forwardRef<HTMLDivElement, BaseSkeletonProps>(
  ({ className, shape, "aria-hidden": ariaHidden, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden={ariaHidden ?? true}
        data-shape={shape ?? "rectangle"}
        className={cn(baseSkeletonVariants({ shape }), className)}
        {...props}
      />
    );
  },
);

BaseSkeleton.displayName = "Skeleton";

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

export interface SkeletonProps extends BaseSkeletonProps, VariantProps<typeof skeletonVariants> {}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, animated = true, ...props }, ref) => {
    return (
      <BaseSkeleton
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
