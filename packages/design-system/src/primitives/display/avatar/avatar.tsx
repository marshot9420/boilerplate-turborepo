"use client";

import { cva, type VariantProps } from "class-variance-authority";

import {
  forwardRef,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
  useState,
} from "react";

import { cn } from "../../../utils";

const avatarVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center overflow-hidden",
    "bg-muted text-muted-foreground",
    "font-medium",
  ],
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-12 text-base",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
    },
  },
);

export interface AvatarProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  imageClassName?: string;
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "className">;
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, imageClassName, size, shape, src, alt, fallback, imageProps, ...props }, ref) => {
    const [hasImageError, setHasImageError] = useState(false);
    const shouldRenderImage = !!src && !hasImageError;

    return (
      <span
        ref={ref}
        data-size={size ?? "md"}
        data-shape={shape ?? "circle"}
        data-has-image={shouldRenderImage ? "true" : "false"}
        className={cn(avatarVariants({ size, shape }), className)}
        {...props}
      >
        {shouldRenderImage ? (
          <img
            src={src}
            alt={alt ?? ""}
            className={cn("size-full object-cover", imageClassName)}
            onError={() => {
              setHasImageError(true);
            }}
            {...imageProps}
          />
        ) : (
          fallback
        )}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";

export default Avatar;
