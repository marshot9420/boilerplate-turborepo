"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

const textCounterVariants = cva("text-xs text-muted-foreground", {
  variants: {
    align: {
      start: "text-left",
      center: "text-center",
      end: "text-right",
    },

    fullWidth: {
      true: "block w-full",
    },

    overLimit: {
      true: "text-destructive",
    },
  },

  defaultVariants: {
    align: "end",
  },
});

export interface TextCounterProps
  extends
    HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof textCounterVariants>, "overLimit"> {
  value?: string | number | null;
  count?: number;
  maxLength?: number;
}

function getTextLength(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return String(value).length;
}

const TextCounter = forwardRef<HTMLSpanElement, TextCounterProps>(
  (
    {
      className,
      value,
      count,
      maxLength,
      align,
      fullWidth,
      "aria-live": ariaLive,
      ...props
    },
    ref,
  ) => {
    const currentLength = count ?? getTextLength(value);
    const hasMaxLength = typeof maxLength === "number";
    const overLimit = hasMaxLength && currentLength > maxLength;
    const content = hasMaxLength
      ? `${currentLength} / ${maxLength}`
      : `${currentLength}`;

    return (
      <span
        ref={ref}
        aria-live={ariaLive ?? "polite"}
        data-count={currentLength}
        data-max-length={hasMaxLength ? maxLength : undefined}
        data-over-limit={overLimit ? "true" : "false"}
        data-full-width={fullWidth ? "true" : "false"}
        className={cn(
          textCounterVariants({
            align,
            fullWidth,
            overLimit,
          }),
          className,
        )}
        {...props}
      >
        {content}
      </span>
    );
  },
);

TextCounter.displayName = "TextCounter";

export default TextCounter;
