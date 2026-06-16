"use client";

import { cva } from "class-variance-authority";

import { forwardRef } from "react";

import {
  LinkButton as PrimitiveLinkButton,
  type LinkButtonProps as PrimitiveLinkButtonProps,
} from "../../../primitives/buttons/link-button";
import { cn } from "../../../utils";

const linkButtonClasses = cva(
  ["rounded-full", "shadow-sm", "active:scale-[0.99]", "motion-reduce:transition-none"],
  {
    variants: {
      variant: {
        default: "shadow-primary/10",
        outline: "bg-surface shadow-none",
        ghost: "shadow-none",
        destructive: "shadow-destructive/10",
      },

      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
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
