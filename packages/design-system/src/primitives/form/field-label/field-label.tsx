"use client";

import { forwardRef, type LabelHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  hasError?: boolean;
  required?: boolean;
  disabled?: boolean;
  requiredSlot?: ReactNode;
}

const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
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

FieldLabel.displayName = "FieldLabel";

export default FieldLabel;
