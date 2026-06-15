"use client";

import { forwardRef, type LabelHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
  requiredSlot?: ReactNode;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      className,
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
        data-required={required ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        className={cn(
          "inline-flex items-center gap-1",
          "text-sm font-medium leading-none text-foreground",
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

Label.displayName = "Label";

export default Label;
