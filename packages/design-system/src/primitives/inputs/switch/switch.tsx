"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "../../../utils";

const switchRootVariants = cva(
  [
    "inline-flex shrink-0 items-center",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-13",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const switchTrackVariants = cva(
  [
    "pointer-events-none relative block rounded-full",
    "bg-muted transition-colors",
    "after:bg-background after:absolute after:rounded-full after:transition-transform",
    "peer-checked:bg-primary",
    "peer-focus-visible:ring-ring peer-focus-visible:ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
    "peer-disabled:cursor-not-allowed",
    "peer-data-[invalid=true]:ring-destructive peer-data-[invalid=true]:ring-2",
  ],
  {
    variants: {
      size: {
        sm: [
          "h-5 w-9",
          "after:top-0.5 after:left-0.5 after:size-4",
          "peer-checked:after:translate-x-4",
        ],
        md: [
          "h-6 w-11",
          "after:top-0.5 after:left-0.5 after:size-5",
          "peer-checked:after:translate-x-5",
        ],
        lg: [
          "h-7 w-13",
          "after:top-0.5 after:left-0.5 after:size-6",
          "peer-checked:after:translate-x-6",
        ],
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface SwitchProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "role">,
    VariantProps<typeof switchRootVariants> {
  hasError?: boolean;
  trackClassName?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      trackClassName,
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
      <label
        data-size={size ?? "md"}
        data-disabled={disabled ? "true" : "false"}
        data-invalid={hasError ? "true" : "false"}
        className={cn(switchRootVariants({ size }), className)}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          disabled={disabled}
          aria-invalid={resolvedAriaInvalid}
          data-size={size ?? "md"}
          data-disabled={disabled ? "true" : "false"}
          data-invalid={hasError ? "true" : "false"}
          className="peer sr-only"
          {...props}
        />

        <span aria-hidden="true" className={cn(switchTrackVariants({ size }), trackClassName)} />
      </label>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
