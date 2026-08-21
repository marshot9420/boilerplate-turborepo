"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

export interface BaseFieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  disabled?: boolean;
}

const BaseFieldDescription = forwardRef<HTMLParagraphElement, BaseFieldDescriptionProps>(
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

BaseFieldDescription.displayName = "FieldDescription";

const fieldDescriptionVariants = cva([], {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
    tone: {
      default: "text-muted-foreground",
      subtle: "text-muted-foreground/75",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});

export interface FieldDescriptionProps
  extends BaseFieldDescriptionProps, VariantProps<typeof fieldDescriptionVariants> {}

const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, size, tone, ...props }, ref) => {
    return (
      <BaseFieldDescription
        ref={ref}
        data-size={size ?? "md"}
        data-tone={tone ?? "default"}
        className={cn(fieldDescriptionVariants({ size, tone }), className)}
        {...props}
      />
    );
  },
);

FieldDescription.displayName = "FieldDescription";

export default FieldDescription;
