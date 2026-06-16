"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef } from "react";

import {
  ImageFrame as PrimitiveImageFrame,
  type ImageFrameProps as PrimitiveImageFrameProps,
} from "../../../primitives/display/image-frame";
import { cn } from "../../../utils";

const imageFrameVariants = cva(["rounded-xl"], {
  variants: {
    variant: {
      default: "border-border/70 border",
      muted: "bg-muted/50 border border-transparent",
      surface: "border-border/70 bg-surface border shadow-sm",
      outline: "border-border bg-background border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ImageFrameProps
  extends PrimitiveImageFrameProps, VariantProps<typeof imageFrameVariants> {}

const ImageFrame = forwardRef<HTMLDivElement, ImageFrameProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <PrimitiveImageFrame
        ref={ref}
        data-variant={variant ?? "default"}
        className={cn(imageFrameVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

ImageFrame.displayName = "ImageFrame";

export default ImageFrame;
