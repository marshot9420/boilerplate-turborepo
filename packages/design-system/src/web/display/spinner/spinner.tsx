"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef } from "react";

import {
  Spinner as PrimitiveSpinner,
  type SpinnerProps as PrimitiveSpinnerProps,
} from "../../../primitives/display/spinner";
import { cn } from "../../../utils";

const spinnerVariants = cva([], {
  variants: {
    variant: {
      default: "border-muted border-t-primary",
      muted: "border-muted/60 border-t-muted-foreground",
      inverse: "border-primary-foreground/30 border-t-primary-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface SpinnerProps extends PrimitiveSpinnerProps, VariantProps<typeof spinnerVariants> {}

const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <PrimitiveSpinner
        ref={ref}
        data-variant={variant ?? "default"}
        className={cn(spinnerVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

Spinner.displayName = "Spinner";

export default Spinner;
