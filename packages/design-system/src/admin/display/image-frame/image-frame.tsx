"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef } from "react";

import {
  ImageFrame as PrimitiveImageFrame,
  type ImageFrameProps as PrimitiveImageFrameProps,
} from "../../../primitives/display/image-frame";
import { cn } from "../../../utils";

const imageFrameVariants = cva(["border"], {
  variants: {
    variant: {
      default: "border-border/80",
      muted: "bg-muted/60 border-transparent",
      surface: "border-border bg-surface shadow-sm",
      outline: "border-border bg-background",
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
