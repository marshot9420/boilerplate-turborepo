"use client";

import { cva } from "class-variance-authority";

import { forwardRef } from "react";

import {
  IconButton as PrimitiveIconButton,
  type IconButtonProps as PrimitiveIconButtonProps,
} from "../../../primitives/buttons/icon-button";
import { cn } from "../../../utils";

const iconButtonClasses = cva(
  [
    "shadow-sm",
    "leading-none",
    "active:scale-[0.98]",
    "motion-reduce:transition-none",
    "[&>svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "shadow-primary/10",
        outline: "bg-surface shadow-none",
        ghost: "shadow-none",
        destructive: "shadow-destructive/10",
      },

      size: {
        sm: ["h-10 min-h-10 w-10 min-w-10 text-lg", "[&>svg]:size-5"],
        md: ["h-11 min-h-11 w-11 min-w-11 text-xl", "[&>svg]:size-6"],
        lg: ["h-12 min-h-12 w-12 min-w-12 text-2xl", "[&>svg]:size-7"],
      },
    },

    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type IconButtonProps = PrimitiveIconButtonProps;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <PrimitiveIconButton
        ref={ref}
        variant={variant}
        size={size}
        className={cn(iconButtonClasses({ variant, size }), className)}
        data-ds-component="icon-button"
        {...props}
      />
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;
