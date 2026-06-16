"use client";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

export type StackDirection = "vertical" | "horizontal";
export type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type StackJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  fullWidth?: boolean;
}

const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = "vertical",
      gap = "md",
      align = "stretch",
      justify = "start",
      wrap = false,
      fullWidth = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          direction === "vertical" && "flex-col",
          direction === "horizontal" && "flex-row",
          gap === "xs" && "gap-1",
          gap === "sm" && "gap-2",
          gap === "md" && "gap-4",
          gap === "lg" && "gap-6",
          gap === "xl" && "gap-8",
          align === "start" && "items-start",
          align === "center" && "items-center",
          align === "end" && "items-end",
          align === "stretch" && "items-stretch",
          align === "baseline" && "items-baseline",
          justify === "start" && "justify-start",
          justify === "center" && "justify-center",
          justify === "end" && "justify-end",
          justify === "between" && "justify-between",
          justify === "around" && "justify-around",
          justify === "evenly" && "justify-evenly",
          wrap && "flex-wrap",
          fullWidth && "w-full",
          className,
        )}
        data-direction={direction}
        data-gap={gap}
        data-align={align}
        data-justify={justify}
        data-wrap={wrap ? "true" : "false"}
        data-full-width={fullWidth ? "true" : "false"}
        {...props}
      />
    );
  },
);

Stack.displayName = "Stack";

export default Stack;
