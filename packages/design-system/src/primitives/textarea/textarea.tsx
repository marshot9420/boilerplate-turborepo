"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "../../utils";

const textareaVariants = cva(
  [
    "flex min-h-24 w-full rounded-md border bg-transparent",
    "px-3 py-2 text-sm",
    "transition-colors",
    "placeholder:text-muted-foreground",
    "outline-none resize-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-red-500",
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

export interface TextareaProps
  extends
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={resolvedAriaInvalid}
        data-error={hasError ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        className={cn(
          textareaVariants({
            size,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
