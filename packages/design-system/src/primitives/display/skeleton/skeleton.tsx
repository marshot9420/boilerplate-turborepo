"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

const skeletonVariants = cva("animate-pulse bg-muted", {
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

export interface SkeletonProps
  extends
    HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, shape, "aria-hidden": ariaHidden, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden={ariaHidden ?? true}
        data-shape={shape ?? "rectangle"}
        className={cn(skeletonVariants({ shape }), className)}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

export default Skeleton;
