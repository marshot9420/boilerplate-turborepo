"use client";

import { forwardRef } from "react";

import {
  NumberInput as PrimitiveNumberInput,
  type NumberInputProps as PrimitiveNumberInputProps,
} from "../../../primitives/inputs/number-input";
import { cn } from "../../../utils";

export type NumberInputProps = PrimitiveNumberInputProps;

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveNumberInput
        ref={ref}
        className={cn(
          "border-border bg-surface shadow-xs",
          "md:hover:border-primary/60",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "focus-visible:border-ring",
          "data-[invalid=true]:border-destructive",
          "data-[disabled=true]:bg-muted",
          className,
        )}
        {...props}
      />
    );
  },
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
