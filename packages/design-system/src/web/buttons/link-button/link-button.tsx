"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";

import { cn } from "../../../utils";

const linkButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-md font-medium whitespace-nowrap",
    "transition-colors",
    "outline-none",
    "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
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

export interface BaseLinkButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkButtonVariants> {
  disabled?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

const BaseLinkButton = forwardRef<HTMLAnchorElement, BaseLinkButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      disabled = false,
      leftSlot,
      rightSlot,
      children,
      tabIndex,
      onClick,
      ...props
    },
    ref,
  ) => {
    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    }
    return (
      <a
        ref={ref}
        aria-disabled={disabled ? true : undefined}
        tabIndex={disabled ? -1 : tabIndex}
        data-variant={variant ?? "default"}
        data-size={size ?? "md"}
        data-disabled={disabled ? "true" : "false"}
        data-full-width={fullWidth ? "true" : "false"}
        className={cn(
          linkButtonVariants({
            variant,
            size,
            fullWidth,
          }),
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {leftSlot}

        {children}

        {rightSlot}
      </a>
    );
  },
);

BaseLinkButton.displayName = "LinkButton";

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

export type LinkButtonProps = BaseLinkButtonProps;

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <BaseLinkButton
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
