"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef } from "react";

import {
  FieldLabel as PrimitiveFieldLabel,
  type FieldLabelProps as PrimitiveFieldLabelProps,
} from "../../../primitives/form/field-label";
import { cn } from "../../../utils";

const fieldLabelVariants = cva([], {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
    weight: {
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    size: "md",
    weight: "medium",
  },
});

export interface FieldLabelProps
  extends PrimitiveFieldLabelProps, VariantProps<typeof fieldLabelVariants> {}

const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, size, weight, ...props }, ref) => {
    return (
      <PrimitiveFieldLabel
        ref={ref}
        data-size={size ?? "md"}
        data-weight={weight ?? "medium"}
        className={cn(fieldLabelVariants({ size, weight }), className)}
        {...props}
      />
    );
  },
);

FieldLabel.displayName = "FieldLabel";

export default FieldLabel;
