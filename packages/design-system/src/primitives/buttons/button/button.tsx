"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-md font-medium whitespace-nowrap",
    "transition-colors",
    "outline-none",
    "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: ["bg-primary text-primary-foreground", "hover:bg-primary/90"],

        outline: ["border-border border", "bg-background text-foreground", "hover:bg-muted"],

        ghost: ["text-foreground bg-transparent", "hover:bg-muted"],

        destructive: ["bg-destructive text-destructive-foreground", "hover:bg-destructive/90"],
      },

      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },

      fullWidth: {
        true: "w-full",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      disabled,
      leftSlot,
      rightSlot,
      children,
      type,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        disabled={isDisabled}
        aria-busy={loading ? true : undefined}
        data-variant={variant ?? "default"}
        data-size={size ?? "md"}
        data-disabled={isDisabled ? "true" : "false"}
        data-loading={loading ? "true" : "false"}
        data-full-width={fullWidth ? "true" : "false"}
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
          }),
          className,
        )}
        {...props}
      >
        {leftSlot}

        {children}

        {rightSlot}
      </button>
    );
  },
);

Button.displayName = "Button";
