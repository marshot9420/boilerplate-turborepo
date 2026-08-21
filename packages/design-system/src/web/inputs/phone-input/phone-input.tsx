"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

const phoneInputRootVariants = cva(
  [
    "border-input flex w-full items-center rounded-md border",
    "bg-background text-foreground",
    "transition-colors",
    "focus-within:ring-ring focus-within:ring-offset-background focus-within:ring-2 focus-within:ring-offset-2",
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
    "text-foreground min-w-0 flex-1 bg-transparent",
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

export interface BasePhoneInputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof phoneInputRootVariants> {
  hasError?: boolean;
  inputClassName?: string;
  prefixSlot?: ReactNode;
  suffixSlot?: ReactNode;
}

const BasePhoneInput = forwardRef<HTMLInputElement, BasePhoneInputProps>(
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
          <span className="text-muted-foreground mr-2 shrink-0">{prefixSlot}</span>
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
          <span className="text-muted-foreground ml-2 shrink-0">{suffixSlot}</span>
        ) : null}
      </div>
    );
  },
);

BasePhoneInput.displayName = "PhoneInput";

export type PhoneInputProps = BasePhoneInputProps;

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, inputClassName, ...props }, ref) => {
    return (
      <BasePhoneInput
        ref={ref}
        className={cn(
          "border-border bg-background",
          "md:hover:border-foreground/50",
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
