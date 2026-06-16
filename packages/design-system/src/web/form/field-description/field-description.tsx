"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef } from "react";

import {
  FieldDescription as PrimitiveFieldDescription,
  type FieldDescriptionProps as PrimitiveFieldDescriptionProps,
} from "../../../primitives/form/field-description";
import { cn } from "../../../utils";

const fieldDescriptionVariants = cva([], {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
    tone: {
      default: "text-muted-foreground",
      subtle: "text-muted-foreground/75",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});

export interface FieldDescriptionProps
  extends PrimitiveFieldDescriptionProps, VariantProps<typeof fieldDescriptionVariants> {}

const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, size, tone, ...props }, ref) => {
    return (
      <PrimitiveFieldDescription
        ref={ref}
        data-size={size ?? "md"}
        data-tone={tone ?? "default"}
        className={cn(fieldDescriptionVariants({ size, tone }), className)}
        {...props}
      />
    );
  },
);

FieldDescription.displayName = "FieldDescription";

export default FieldDescription;
