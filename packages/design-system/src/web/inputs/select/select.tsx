"use client";

import { forwardRef } from "react";

import {
  Select as PrimitiveSelect,
  type SelectProps as PrimitiveSelectProps,
} from "../../../primitives/inputs/select";
import { cn } from "../../../utils";

export type SelectProps = PrimitiveSelectProps;

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => {
  return (
    <PrimitiveSelect
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

Select.displayName = "Select";

export default Select;
