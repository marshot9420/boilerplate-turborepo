"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

const textCounterVariants = cva("text-muted-foreground text-xs", {
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

export type TextCounterCountStrategy = "code-unit" | "grapheme";

export interface TextCounterProps
  extends
    HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof textCounterVariants>, "overLimit"> {
  value?: string | number | null;
  count?: number;
  maxLength?: number;

  /**
   * value 기반 count 계산 방식.
   *
   * - code-unit: String(value).length 기준. 기본값.
   * - grapheme: Intl.Segmenter 기반 사용자 체감 글자 수 기준.
   *
   * count를 직접 전달하면 count가 value 계산보다 우선한다.
   */
  countStrategy?: TextCounterCountStrategy;
}

type IntlSegmenterConstructor = new (
  locales?: string | string[],
  options?: {
    granularity?: "grapheme" | "word" | "sentence";
  },
) => {
  segment(input: string): Iterable<unknown>;
};

function getIntlSegmenter(): IntlSegmenterConstructor | undefined {
  const intlObject = Intl as typeof Intl & {
    Segmenter?: IntlSegmenterConstructor;
  };

  return intlObject.Segmenter;
}

function getCodeUnitLength(value: string | number | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }

  return String(value).length;
}

function getGraphemeLength(value: string | number | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }

  const text = String(value);

  if (!text) {
    return 0;
  }

  const Segmenter = getIntlSegmenter();

  if (!Segmenter) {
    return Array.from(text).length;
  }

  const segmenter = new Segmenter(undefined, {
    granularity: "grapheme",
  });

  return Array.from(segmenter.segment(text)).length;
}

function getTextLength(
  value: string | number | null | undefined,
  countStrategy: TextCounterCountStrategy,
): number {
  if (countStrategy === "grapheme") {
    return getGraphemeLength(value);
  }

  return getCodeUnitLength(value);
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
      countStrategy = "code-unit",
      "aria-live": ariaLive,
      ...props
    },
    ref,
  ) => {
    const currentLength = count ?? getTextLength(value, countStrategy);
    const hasMaxLength = typeof maxLength === "number";
    const overLimit = hasMaxLength && currentLength > maxLength;
    const content = hasMaxLength ? `${currentLength} / ${maxLength}` : `${currentLength}`;

    return (
      <span
        ref={ref}
        aria-live={ariaLive ?? "polite"}
        data-count={currentLength}
        data-max-length={hasMaxLength ? maxLength : undefined}
        data-over-limit={overLimit ? "true" : "false"}
        data-full-width={fullWidth ? "true" : "false"}
        data-count-strategy={countStrategy}
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
