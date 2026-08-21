"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "../../../utils";

const inputVariants = cva(
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

export interface BaseInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof inputVariants> {
  hasError?: boolean;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, size, hasError = false, disabled, "aria-invalid": ariaInvalid, ...props }, ref) => {
    const resolvedAriaInvalid = ariaInvalid ?? (hasError ? true : undefined);
    return (
      <input
        ref={ref}
        disabled={disabled}
        aria-invalid={resolvedAriaInvalid}
        data-size={size ?? "md"}
        data-disabled={disabled ? "true" : "false"}
        data-invalid={hasError ? "true" : "false"}
        className={cn(inputVariants({ size }), className)}
        {...props}
      />
    );
  },
);

BaseInput.displayName = "Input";

export type InputProps = BaseInputProps;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <BaseInput
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
