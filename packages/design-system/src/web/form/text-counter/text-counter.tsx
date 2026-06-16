"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef } from "react";

import {
  TextCounter as PrimitiveTextCounter,
  type TextCounterProps as PrimitiveTextCounterProps,
} from "../../../primitives/form/text-counter";
import { cn } from "../../../utils";

const textCounterVariants = cva(["tabular-nums"], {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
    },
  },
  defaultVariants: {
    size: "sm",
    weight: "normal",
  },
});

export interface TextCounterProps
  extends PrimitiveTextCounterProps, VariantProps<typeof textCounterVariants> {}

const TextCounter = forwardRef<HTMLSpanElement, TextCounterProps>(
  ({ className, size, weight, ...props }, ref) => {
    return (
      <PrimitiveTextCounter
        ref={ref}
        data-size={size ?? "sm"}
        data-weight={weight ?? "normal"}
        className={cn(textCounterVariants({ size, weight }), className)}
        {...props}
      />
    );
  },
);

TextCounter.displayName = "TextCounter";

export default TextCounter;
