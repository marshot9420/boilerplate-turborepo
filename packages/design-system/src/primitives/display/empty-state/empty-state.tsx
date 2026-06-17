"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

const emptyStateVariants = cva(
  [
    "flex flex-col items-center justify-center text-center",
    "border-border rounded-lg border border-dashed",
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

export type EmptyStateHeadingElement = "p" | "h2" | "h3" | "h4";

export interface EmptyStateProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof emptyStateVariants> {
  icon?: ReactNode;
  heading?: ReactNode;
  headingElement?: EmptyStateHeadingElement;
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
      headingElement = "p",
      description,
      action,
      children,
      ...props
    },
    ref,
  ) => {
    const HeadingElement = headingElement;

    return (
      <div
        ref={ref}
        data-size={size ?? "md"}
        data-full-width={fullWidth ? "true" : "false"}
        data-heading-element={headingElement}
        className={cn(emptyStateVariants({ size, fullWidth }), className)}
        {...props}
      >
        {icon ? (
          <div className="text-muted-foreground" aria-hidden="true">
            {icon}
          </div>
        ) : null}

        {heading ? (
          <HeadingElement className="text-foreground text-sm font-medium">{heading}</HeadingElement>
        ) : null}

        {description ? (
          <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
        ) : null}

        {action ? <div>{action}</div> : null}

        {children}
      </div>
    );
  },
);

EmptyState.displayName = "EmptyState";

export default EmptyState;
