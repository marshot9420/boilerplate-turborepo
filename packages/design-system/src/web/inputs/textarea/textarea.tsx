"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "../../../utils";

const textareaVariants = cva(
  [
    "border-input flex min-h-24 w-full rounded-md border",
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
        sm: "px-3 py-2 text-sm",
        md: "px-3 py-2 text-sm",
        lg: "px-4 py-3 text-base",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      size: "md",
      resize: "vertical",
    },
  },
);

export interface BaseTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {
  hasError?: boolean;
}

const BaseTextarea = forwardRef<HTMLTextAreaElement, BaseTextareaProps>(
  (
    { className, size, resize, hasError = false, disabled, "aria-invalid": ariaInvalid, ...props },
    ref,
  ) => {
    const resolvedAriaInvalid = ariaInvalid ?? (hasError ? true : undefined);
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={resolvedAriaInvalid}
        data-size={size ?? "md"}
        data-resize={resize ?? "vertical"}
        data-disabled={disabled ? "true" : "false"}
        data-invalid={hasError ? "true" : "false"}
        className={cn(textareaVariants({ size, resize }), className)}
        {...props}
      />
    );
  },
);

BaseTextarea.displayName = "Textarea";

export type TextareaProps = BaseTextareaProps;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <BaseTextarea
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

Textarea.displayName = "Textarea";

export default Textarea;
