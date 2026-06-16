"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

const emptyStateVariants = cva(
  [
    "flex flex-col items-center justify-center text-center",
    "rounded-lg border border-dashed border-border",
    "bg-background text-foreground",
  ],
  {
    variants: {
      size: {
        sm: "gap-2 p-4",
        md: "gap-3 p-6",
        lg: "gap-4 p-8",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface EmptyStateProps
  extends
    HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: ReactNode;
  heading?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      size,
      fullWidth,
      icon,
      heading,
      description,
      action,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-size={size ?? "md"}
        data-full-width={fullWidth ? "true" : "false"}
        className={cn(emptyStateVariants({ size, fullWidth }), className)}
        {...props}
      >
        {icon ? (
          <div className="text-muted-foreground" aria-hidden="true">
            {icon}
          </div>
        ) : null}

        {heading ? (
          <p className="text-sm font-medium text-foreground">{heading}</p>
        ) : null}

        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}

        {action ? <div>{action}</div> : null}

        {children}
      </div>
    );
  },
);

EmptyState.displayName = "EmptyState";

export default EmptyState;
