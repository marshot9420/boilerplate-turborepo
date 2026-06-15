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
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: ["bg-primary text-primary-foreground", "hover:bg-primary/90"],

        outline: [
          "border border-border",
          "bg-background text-foreground",
          "hover:bg-muted",
        ],

        ghost: ["bg-transparent text-foreground", "hover:bg-muted"],

        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/90",
        ],
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

type NativeIconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
>;

export type IconButtonProps = NativeIconButtonProps &
  VariantProps<typeof iconButtonVariants> &
  AccessibleIconButtonName & {
    children: ReactNode;
    loading?: boolean;
  };

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      loading = false,
      disabled,
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

IconButton.displayName = "IconButton";

export default IconButton;
