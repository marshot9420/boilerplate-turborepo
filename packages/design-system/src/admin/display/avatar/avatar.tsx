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

export interface BaseAvatarProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  imageClassName?: string;
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "className">;
}

const BaseAvatar = forwardRef<HTMLSpanElement, BaseAvatarProps>(
  ({ className, imageClassName, size, shape, src, alt, fallback, imageProps, ...props }, ref) => {
    const [hasImageError, setHasImageError] = useState(false);
    const shouldRenderImage = !!src && !hasImageError;
    const handleImageError: ImgHTMLAttributes<HTMLImageElement>["onError"] = (event) => {
      setHasImageError(true);
      imageProps?.onError?.(event);
    };
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
            {...imageProps}
            src={src}
            alt={alt ?? ""}
            className={cn("size-full object-cover", imageClassName)}
            onError={handleImageError}
          />
        ) : (
          fallback
        )}
      </span>
    );
  },
);

BaseAvatar.displayName = "Avatar";

const avatarClasses = cva(["ring-1", "ring-border", "shadow-none"], {
  variants: {
    size: {
      sm: "size-8 text-xs",
      md: "size-9 text-sm",
      lg: "size-11 text-base",
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
});

const imageClasses = cva(["transition-none"]);

export type AvatarProps = BaseAvatarProps;

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, imageClassName, size, shape, ...props }, ref) => {
    return (
      <BaseAvatar
        ref={ref}
        size={size}
        shape={shape}
        className={cn(avatarClasses({ size, shape }), className)}
        imageClassName={cn(imageClasses(), imageClassName)}
        {...props}
        data-ds-component="avatar"
      />
    );
  },
);

Avatar.displayName = "Avatar";

export default Avatar;
