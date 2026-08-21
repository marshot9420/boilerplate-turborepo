"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "../../../utils";

const checkboxVariants = cva(
  [
    "border-input shrink-0 rounded border",
    "bg-background text-primary accent-primary",
    "transition-colors",
    "outline-none",
    "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[invalid=true]:border-destructive",
  ],
  {
    variants: {
      size: {
        sm: "size-3.5",
        md: "size-4",
        lg: "size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface BaseCheckboxProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof checkboxVariants> {
  hasError?: boolean;
}

const BaseCheckbox = forwardRef<HTMLInputElement, BaseCheckboxProps>(
  ({ className, size, hasError = false, disabled, "aria-invalid": ariaInvalid, ...props }, ref) => {
    const resolvedAriaInvalid = ariaInvalid ?? (hasError ? true : undefined);
    return (
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        aria-invalid={resolvedAriaInvalid}
        data-size={size ?? "md"}
        data-disabled={disabled ? "true" : "false"}
        data-invalid={hasError ? "true" : "false"}
        className={cn(checkboxVariants({ size }), className)}
        {...props}
      />
    );
  },
);

BaseCheckbox.displayName = "Checkbox";

export type CheckboxProps = BaseCheckboxProps;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  return (
    <BaseCheckbox
      ref={ref}
      className={cn(
        "border-border bg-surface accent-primary shadow-xs",
        "checked:border-primary",
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
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
