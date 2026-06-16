"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "../../../utils";

const numberInputVariants = cva(
  [
    "border-input flex w-full rounded-md border",
    "bg-background text-foreground",
    "transition-colors",
    "outline-none",
    "placeholder:text-muted-foreground",
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

export interface NumberInputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof numberInputVariants> {
  hasError?: boolean;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      size,
      hasError = false,
      disabled,
      inputMode,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const resolvedAriaInvalid = ariaInvalid ?? (hasError ? true : undefined);

    return (
      <input
        ref={ref}
        type="number"
        inputMode={inputMode ?? "decimal"}
        disabled={disabled}
        aria-invalid={resolvedAriaInvalid}
        data-size={size ?? "md"}
        data-disabled={disabled ? "true" : "false"}
        data-invalid={hasError ? "true" : "false"}
        className={cn(numberInputVariants({ size }), className)}
        {...props}
      />
    );
  },
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
