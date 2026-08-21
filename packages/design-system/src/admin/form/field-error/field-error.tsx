"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

function hasFieldErrorContent(content: ReactNode): boolean {
  if (content === null || content === undefined) {
    return false;
  }
  if (typeof content === "boolean") {
    return false;
  }
  if (typeof content === "string" && content.length === 0) {
    return false;
  }
  return true;
}

export interface BaseFieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: ReactNode;
}

const BaseFieldError = forwardRef<HTMLParagraphElement, BaseFieldErrorProps>(
  ({ className, message, children, role, "aria-live": ariaLive, ...props }, ref) => {
    const content = children ?? message;
    if (!hasFieldErrorContent(content)) {
      return null;
    }
    return (
      <p
        ref={ref}
        role={role ?? "alert"}
        aria-live={ariaLive ?? "polite"}
        className={cn("text-destructive text-sm", className)}
        {...props}
      >
        {content}
      </p>
    );
  },
);

BaseFieldError.displayName = "FieldError";

const fieldErrorVariants = cva(["leading-relaxed"], {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface FieldErrorProps
  extends BaseFieldErrorProps, VariantProps<typeof fieldErrorVariants> {}

const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <BaseFieldError
        ref={ref}
        data-size={size ?? "md"}
        className={cn(fieldErrorVariants({ size }), className)}
        {...props}
      />
    );
  },
);

FieldError.displayName = "FieldError";

export default FieldError;
