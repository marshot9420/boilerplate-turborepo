"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: ReactNode;
}

const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
  (
    { className, message, children, role, "aria-live": ariaLive, ...props },
    ref,
  ) => {
    const content = children ?? message;

    if (!content) {
      return null;
    }

    return (
      <p
        ref={ref}
        role={role ?? "alert"}
        aria-live={ariaLive ?? "polite"}
        className={cn("text-sm text-destructive", className)}
        {...props}
      >
        {content}
      </p>
    );
  },
);

FieldError.displayName = "FieldError";

export default FieldError;
