"use client";

import { forwardRef } from "react";

import {
  Checkbox as PrimitiveCheckbox,
  type CheckboxProps as PrimitiveCheckboxProps,
} from "../../../primitives/inputs/checkbox";
import { cn } from "../../../utils";

export type CheckboxProps = PrimitiveCheckboxProps;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  return (
    <PrimitiveCheckbox
      ref={ref}
      className={cn(
        "border-border bg-background accent-primary",
        "checked:border-primary",
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

Checkbox.displayName = "Checkbox";

export default Checkbox;
