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
    "shadow-none",
    "leading-none",
    "active:translate-y-px",
    "motion-reduce:transition-none",
    "[&>svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "hover:bg-primary/85",
        outline: "bg-surface hover:bg-muted/80",
        ghost: "hover:bg-muted/80",
        destructive: "hover:bg-destructive/85",
      },

      size: {
        sm: ["h-8 min-h-8 w-8 min-w-8 text-base", "[&>svg]:size-4"],
        md: ["h-9 min-h-9 w-9 min-w-9 text-lg", "[&>svg]:size-5"],
        lg: ["h-10 min-h-10 w-10 min-w-10 text-xl", "[&>svg]:size-6"],
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
