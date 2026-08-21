"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

const iconButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center",
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
        sm: "size-8 text-sm",
        md: "size-10 text-sm",
        lg: "size-12 text-base",
      },
      shape: {
        square: "rounded-md",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "square",
    },
  },
);

type AccessibleIconButtonName =
  | {
      "aria-label": string;
      "aria-labelledby"?: string;
    }
  | {
      "aria-label"?: string;
      "aria-labelledby": string;
    };

type NativeIconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export type BaseIconButtonProps = NativeIconButtonProps &
  VariantProps<typeof iconButtonVariants> &
  AccessibleIconButtonName & {
    children: ReactNode;
    loading?: boolean;
  };

const BaseIconButton = forwardRef<HTMLButtonElement, BaseIconButtonProps>(
  (
    { className, variant, size, shape, loading = false, disabled, children, type, ...props },
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
        data-shape={shape ?? "square"}
        data-disabled={isDisabled ? "true" : "false"}
        data-loading={loading ? "true" : "false"}
        className={cn(iconButtonVariants({ variant, size, shape }), className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

BaseIconButton.displayName = "IconButton";

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

export type IconButtonProps = BaseIconButtonProps;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <BaseIconButton
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
