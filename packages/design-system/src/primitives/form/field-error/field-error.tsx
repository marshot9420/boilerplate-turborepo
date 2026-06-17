"use client";

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

export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: ReactNode;
}

const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
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

FieldError.displayName = "FieldError";

export default FieldError;
