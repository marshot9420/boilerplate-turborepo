"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef } from "react";

import {
  FieldError as PrimitiveFieldError,
  type FieldErrorProps as PrimitiveFieldErrorProps,
} from "../../../primitives/form/field-error";
import { cn } from "../../../utils";

const fieldErrorVariants = cva(["leading-relaxed"], {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface FieldErrorProps
  extends PrimitiveFieldErrorProps, VariantProps<typeof fieldErrorVariants> {}

const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <PrimitiveFieldError
        ref={ref}
        data-size={size ?? "md"}
        className={cn(fieldErrorVariants({ size }), className)}
        {...props}
      />
    );
  },
);

FieldError.displayName = "FieldError";

export default FieldError;
