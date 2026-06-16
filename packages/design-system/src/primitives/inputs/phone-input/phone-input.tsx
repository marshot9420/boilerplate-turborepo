"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

const phoneInputRootVariants = cva(
  [
    "flex w-full items-center rounded-md border border-input",
    "bg-background text-foreground",
    "transition-colors",
    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
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

const phoneInputVariants = cva(
  [
    "min-w-0 flex-1 bg-transparent text-foreground",
    "outline-none",
    "placeholder:text-muted-foreground",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
      },
    },

    defaultVariants: {
      size: "md",
    },
  },
);

export interface PhoneInputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof phoneInputRootVariants> {
  hasError?: boolean;
  inputClassName?: string;
  prefixSlot?: ReactNode;
  suffixSlot?: ReactNode;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      inputClassName,
      size,
      hasError = false,
      disabled,
      prefixSlot,
      suffixSlot,
      "aria-invalid": ariaInvalid,
      autoComplete,
      inputMode,
      ...props
    },
    ref,
  ) => {
    const resolvedAriaInvalid = ariaInvalid ?? (hasError ? true : undefined);

    return (
      <div
        data-size={size ?? "md"}
        data-disabled={disabled ? "true" : "false"}
        data-invalid={hasError ? "true" : "false"}
        className={cn(phoneInputRootVariants({ size }), className)}
      >
        {prefixSlot ? (
          <span className="mr-2 shrink-0 text-muted-foreground">
            {prefixSlot}
          </span>
        ) : null}

        <input
          ref={ref}
          type="tel"
          inputMode={inputMode ?? "tel"}
          autoComplete={autoComplete ?? "tel"}
          disabled={disabled}
          aria-invalid={resolvedAriaInvalid}
          data-size={size ?? "md"}
          data-disabled={disabled ? "true" : "false"}
          data-invalid={hasError ? "true" : "false"}
          className={cn(phoneInputVariants({ size }), inputClassName)}
          {...props}
        />

        {suffixSlot ? (
          <span className="ml-2 shrink-0 text-muted-foreground">
            {suffixSlot}
          </span>
        ) : null}
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
