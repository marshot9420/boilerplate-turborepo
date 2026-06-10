"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type LabelHTMLAttributes } from "react";

import { cn } from "../../utils";

const labelVariants = cva(
  [
    "text-sm font-medium leading-none",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  ],
  {
    variants: {
      required: {
        true: "after:ml-1 after:text-red-500 after:content-['*']",
      },
    },
  },
);

export interface LabelProps
  extends
    LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ required }), className)}
        data-required={required ? "true" : "false"}
        {...props}
      />
    );
  },
);

Label.displayName = "Label";

export default Label;
