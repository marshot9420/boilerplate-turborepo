"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef } from "react";

import {
  Field as PrimitiveField,
  type FieldProps as PrimitiveFieldProps,
} from "../../../primitives/form/field";
import { cn } from "../../../utils";

const fieldVariants = cva(["data-[disabled=true]:opacity-60"], {
  variants: {
    spacing: {
      sm: "gap-1",
      md: "gap-2",
      lg: "gap-3",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

export interface FieldProps extends PrimitiveFieldProps, VariantProps<typeof fieldVariants> {}

const Field = forwardRef<HTMLDivElement, FieldProps>(({ className, spacing, ...props }, ref) => {
  return (
    <PrimitiveField
      ref={ref}
      data-spacing={spacing ?? "md"}
      className={cn(fieldVariants({ spacing }), className)}
      {...props}
    />
  );
});

Field.displayName = "Field";

export default Field;
