"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "../../utils";

const inputVariants = cva(
  [
    "flex w-full rounded-md border bg-transparent",
    "px-3 py-2 text-sm",
    "transition-colors",
    "placeholder:text-muted-foreground",
    "outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-red-500",
  ],
  {
    variants: {
      size: {
        sm: "h-8",
        md: "h-10",
        lg: "h-12 text-base",
      },
    },

    defaultVariants: {
      size: "md",
    },
  },
);

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      hasError = false,
      disabled,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const resolvedAriaInvalid = ariaInvalid ?? (hasError ? true : undefined);

    return (
      <input
        ref={ref}
        disabled={disabled}
        aria-invalid={resolvedAriaInvalid}
        data-error={hasError ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        className={cn(inputVariants({ size }), className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
