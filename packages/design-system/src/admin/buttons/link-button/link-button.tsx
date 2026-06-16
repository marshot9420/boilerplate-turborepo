"use client";

import { cva } from "class-variance-authority";

import { forwardRef } from "react";

import {
  LinkButton as PrimitiveLinkButton,
  type LinkButtonProps as PrimitiveLinkButtonProps,
} from "../../../primitives/buttons/link-button";
import { cn } from "../../../utils";

const linkButtonClasses = cva(
  [
    "rounded-md",
    "font-semibold",
    "shadow-none",
    "active:translate-y-px",
    "motion-reduce:transition-none",
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
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-3.5 text-sm",
        lg: "h-10 px-4 text-sm",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type LinkButtonProps = PrimitiveLinkButtonProps;

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <PrimitiveLinkButton
        ref={ref}
        variant={variant}
        size={size}
        className={cn(linkButtonClasses({ variant, size }), className)}
        data-ds-component="link-button"
        {...props}
      />
    );
  },
);

LinkButton.displayName = "LinkButton";

export default LinkButton;
