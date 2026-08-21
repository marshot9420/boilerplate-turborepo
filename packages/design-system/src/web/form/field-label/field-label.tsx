"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type LabelHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

export interface BaseFieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  hasError?: boolean;
  required?: boolean;
  disabled?: boolean;
  requiredSlot?: ReactNode;
}

const BaseFieldLabel = forwardRef<HTMLLabelElement, BaseFieldLabelProps>(
  (
    {
      className,
      hasError = false,
      required = false,
      disabled = false,
      requiredSlot,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <label
        ref={ref}
        data-invalid={hasError ? "true" : "false"}
        data-required={required ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        className={cn(
          "inline-flex items-center gap-1",
          "text-foreground text-sm leading-none font-medium",
          "data-[invalid=true]:text-destructive",
          "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
          className,
        )}
        {...props}
      >
        {children}

        {required ? (
          <span aria-hidden="true" className="text-destructive">
            {requiredSlot ?? "*"}
          </span>
        ) : null}
      </label>
    );
  },
);

BaseFieldLabel.displayName = "FieldLabel";

const fieldLabelVariants = cva([], {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
    weight: {
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    size: "md",
    weight: "medium",
  },
});

export interface FieldLabelProps
  extends BaseFieldLabelProps, VariantProps<typeof fieldLabelVariants> {}

const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, size, weight, ...props }, ref) => {
    return (
      <BaseFieldLabel
        ref={ref}
        data-size={size ?? "md"}
        data-weight={weight ?? "medium"}
        className={cn(fieldLabelVariants({ size, weight }), className)}
        {...props}
      />
    );
  },
);

FieldLabel.displayName = "FieldLabel";

export default FieldLabel;
