"use client";

import { forwardRef } from "react";

import {
  Textarea as PrimitiveTextarea,
  type TextareaProps as PrimitiveTextareaProps,
} from "../../../primitives/inputs/textarea";
import { cn } from "../../../utils";

export type TextareaProps = PrimitiveTextareaProps;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <PrimitiveTextarea
      ref={ref}
      className={cn(
        "border-border bg-background",
        "md:hover:border-foreground/50",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "focus-visible:border-ring",
        "data-[invalid=true]:border-destructive",
        "data-[disabled=true]:bg-muted",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
