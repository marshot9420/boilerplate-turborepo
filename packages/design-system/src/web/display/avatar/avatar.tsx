"use client";

import { cva } from "class-variance-authority";

import { forwardRef } from "react";

import {
  Avatar as PrimitiveAvatar,
  type AvatarProps as PrimitiveAvatarProps,
} from "../../../primitives/display/avatar";
import { cn } from "../../../utils";

const avatarClasses = cva(["ring-2", "ring-background", "shadow-sm"], {
  variants: {
    size: {
      sm: "size-9 text-sm",
      md: "size-11 text-base",
      lg: "size-14 text-lg",
    },
    shape: {
      circle: "rounded-full",
      square: "rounded-xl",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "circle",
  },
});

const imageClasses = cva(["transition-transform"]);

export type AvatarProps = PrimitiveAvatarProps;

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, imageClassName, size, shape, ...props }, ref) => {
    return (
      <PrimitiveAvatar
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
