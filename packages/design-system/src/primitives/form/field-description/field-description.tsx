"use client";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

export interface FieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  disabled?: boolean;
}

const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, disabled = false, ...props }, ref) => {
    return (
      <p
        ref={ref}
        data-disabled={disabled ? "true" : "false"}
        className={cn(
          "text-muted-foreground text-sm",
          "data-[disabled=true]:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

FieldDescription.displayName = "FieldDescription";

export default FieldDescription;
