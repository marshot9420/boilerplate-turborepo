"use client";

import { forwardRef } from "react";

import {
  PhoneInput as PrimitivePhoneInput,
  type PhoneInputProps as PrimitivePhoneInputProps,
} from "../../../primitives/inputs/phone-input";
import { cn } from "../../../utils";

export type PhoneInputProps = PrimitivePhoneInputProps;

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, inputClassName, ...props }, ref) => {
    return (
      <PrimitivePhoneInput
        ref={ref}
        className={cn(
          "border-border bg-surface shadow-xs",
          "md:hover:border-primary/60",
          "focus-within:ring-0 focus-within:ring-offset-0",
          "focus-within:border-ring",
          "data-[invalid=true]:border-destructive",
          "data-[disabled=true]:bg-muted",
          className,
        )}
        inputClassName={cn("selection:bg-primary/20", inputClassName)}
        {...props}
      />
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
