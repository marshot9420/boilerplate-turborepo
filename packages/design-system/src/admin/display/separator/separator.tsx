"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

const baseSeparatorVariants = cva("bg-border shrink-0", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type SeparatorOrientation = "horizontal" | "vertical";

export interface BaseSeparatorProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof baseSeparatorVariants> {
  decorative?: boolean;
}

const BaseSeparator = forwardRef<HTMLDivElement, BaseSeparatorProps>(
  (
    {
      className,
      orientation,
      decorative = true,
      role,
      "aria-orientation": ariaOrientation,
      ...props
    },
    ref,
  ) => {
    const resolvedOrientation: SeparatorOrientation = orientation ?? "horizontal";
    return (
      <div
        ref={ref}
        role={decorative ? "none" : (role ?? "separator")}
        aria-orientation={decorative ? undefined : (ariaOrientation ?? resolvedOrientation)}
        data-orientation={resolvedOrientation}
        data-decorative={decorative ? "true" : "false"}
        className={cn(baseSeparatorVariants({ orientation: resolvedOrientation }), className)}
        {...props}
      />
    );
  },
);

BaseSeparator.displayName = "Separator";

type SeparatorSpacing = "none" | "sm" | "md" | "lg";

const separatorVariants = cva([], {
  variants: {
    variant: {
      default: "bg-border",
      muted: "bg-border/60",
      strong: "bg-foreground/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const horizontalSpacingClassNames: Record<SeparatorSpacing, string> = {
  none: "",
  sm: "my-2",
  md: "my-4",
  lg: "my-6",
};

const verticalSpacingClassNames: Record<SeparatorSpacing, string> = {
  none: "",
  sm: "mx-2",
  md: "mx-4",
  lg: "mx-6",
};

export interface SeparatorProps extends BaseSeparatorProps, VariantProps<typeof separatorVariants> {
  spacing?: SeparatorSpacing;
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, variant, spacing = "none", orientation, ...props }, ref) => {
    const resolvedOrientation = orientation ?? "horizontal";
    const spacingClassName =
      resolvedOrientation === "vertical"
        ? verticalSpacingClassNames[spacing]
        : horizontalSpacingClassNames[spacing];
    return (
      <BaseSeparator
        ref={ref}
        orientation={resolvedOrientation}
        data-variant={variant ?? "default"}
        data-spacing={spacing}
        className={cn(separatorVariants({ variant }), spacingClassName, className)}
        {...props}
      />
    );
  },
);

Separator.displayName = "Separator";

export default Separator;
