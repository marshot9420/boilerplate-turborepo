"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "../../../utils";

const selectVariants = cva(
  [
    "border-input flex w-full rounded-md border",
    "bg-background text-foreground",
    "transition-colors",
    "outline-none",
    "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[invalid=true]:border-destructive",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface BaseSelectProps
  extends
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  hasError?: boolean;
}

const BaseSelect = forwardRef<HTMLSelectElement, BaseSelectProps>(
  (
    {
      className,
      size,
      hasError = false,
      disabled,
      "aria-invalid": ariaInvalid,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedAriaInvalid = ariaInvalid ?? (hasError ? true : undefined);
    return (
      <select
        ref={ref}
        disabled={disabled}
        aria-invalid={resolvedAriaInvalid}
        data-size={size ?? "md"}
        data-disabled={disabled ? "true" : "false"}
        data-invalid={hasError ? "true" : "false"}
        className={cn(selectVariants({ size }), className)}
        {...props}
      >
        {children}
      </select>
    );
  },
);

BaseSelect.displayName = "Select";

export type SelectProps = BaseSelectProps;

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => {
  return (
    <BaseSelect
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
});

Select.displayName = "Select";

export default Select;
