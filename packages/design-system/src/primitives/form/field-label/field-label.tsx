"use client";

import { forwardRef } from "react";

import { cn } from "../../../utils";
import {
  Label as LabelPrimitive,
  type LabelProps as LabelPrimitiveProps,
} from "../../label";

export interface FieldLabelProps extends LabelPrimitiveProps {
  hasError?: boolean;
}

const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, hasError = false, ...props }, ref) => {
    return (
      <LabelPrimitive
        ref={ref}
        data-invalid={hasError ? "true" : "false"}
        className={cn("data-[invalid=true]:text-destructive", className)}
        {...props}
      />
    );
  },
);

FieldLabel.displayName = "FieldLabel";

export default FieldLabel;
