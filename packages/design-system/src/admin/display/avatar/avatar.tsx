"use client";

import { cva } from "class-variance-authority";

import { forwardRef } from "react";

import {
  Avatar as PrimitiveAvatar,
  type AvatarProps as PrimitiveAvatarProps,
} from "../../../primitives/display/avatar";
import { cn } from "../../../utils";

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
