"use client";

import { forwardRef } from "react";

import {
  Input as PrimitiveInput,
  type InputProps as PrimitiveInputProps,
} from "../../../primitives/inputs/input";
import { cn } from "../../../utils";

export type InputProps = PrimitiveInputProps;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <PrimitiveInput
      ref={ref}
      className={cn(
        "border-border bg-background",
        "md:hover:border-foreground/50",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "focus-visible:border-ring",
        "data-[invalid=true]:border-destructive",
        "data-[disabled=true]:bg-muted",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
