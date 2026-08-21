"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "../../../utils";

const fileInputVariants = cva(
  [
    "border-input flex w-full rounded-md border",
    "bg-background text-foreground",
    "transition-colors",
    "outline-none",
    "file:mr-3 file:rounded-md file:border-0",
    "file:bg-muted file:text-foreground file:px-3 file:py-1.5 file:text-sm file:font-medium",
    "hover:file:bg-muted/80",
    "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "disabled:file:cursor-not-allowed",
    "data-[invalid=true]:border-destructive",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-2 py-1 text-sm file:py-1",
        md: "h-10 px-2 py-1.5 text-sm",
        lg: "h-12 px-3 py-2 text-base file:py-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface BaseFileInputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof fileInputVariants> {
  hasError?: boolean;
}

const BaseFileInput = forwardRef<HTMLInputElement, BaseFileInputProps>(
  (
    {
      className,
      size,
      hasError = false,
      disabled,
      multiple,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const resolvedAriaInvalid = ariaInvalid ?? (hasError ? true : undefined);
    return (
      <input
        ref={ref}
        type="file"
        multiple={multiple}
        disabled={disabled}
        aria-invalid={resolvedAriaInvalid}
        data-size={size ?? "md"}
        data-disabled={disabled ? "true" : "false"}
        data-invalid={hasError ? "true" : "false"}
        data-multiple={multiple ? "true" : "false"}
        className={cn(fileInputVariants({ size }), className)}
        {...props}
      />
    );
  },
);

BaseFileInput.displayName = "FileInput";

export type FileInputProps = BaseFileInputProps;

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(({ className, ...props }, ref) => {
  return (
    <BaseFileInput
      ref={ref}
      className={cn(
        "border-border bg-surface shadow-xs",
        "file:bg-muted file:text-foreground",
        "file:transition-colors",
        "md:hover:border-primary/60 md:hover:file:bg-muted/80",
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

FileInput.displayName = "FileInput";

export default FileInput;
