"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef } from "react";

import {
  Separator as PrimitiveSeparator,
  type SeparatorProps as PrimitiveSeparatorProps,
} from "../../../primitives/display/separator";
import { cn } from "../../../utils";

type SeparatorSpacing = "none" | "sm" | "md" | "lg";

const separatorVariants = cva([], {
  variants: {
    variant: {
      default: "bg-border",
      muted: "bg-border/50",
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
  lg: "my-8",
};

const verticalSpacingClassNames: Record<SeparatorSpacing, string> = {
  none: "",
  sm: "mx-2",
  md: "mx-4",
  lg: "mx-8",
};

export interface SeparatorProps
  extends PrimitiveSeparatorProps, VariantProps<typeof separatorVariants> {
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
      <PrimitiveSeparator
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
