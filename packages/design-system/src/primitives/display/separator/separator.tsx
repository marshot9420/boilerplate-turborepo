"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

const separatorVariants = cva("bg-border shrink-0", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof separatorVariants> {
  decorative?: boolean;
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation,
      decorative = true,
      role,
      "aria-orientation": ariaOrientation,
      ...props
    },
    ref,
  ) => {
    const resolvedOrientation: SeparatorOrientation = orientation ?? "horizontal";

    return (
      <div
        ref={ref}
        role={decorative ? "none" : (role ?? "separator")}
        aria-orientation={decorative ? undefined : (ariaOrientation ?? resolvedOrientation)}
        data-orientation={resolvedOrientation}
        data-decorative={decorative ? "true" : "false"}
        className={cn(separatorVariants({ orientation: resolvedOrientation }), className)}
        {...props}
      />
    );
  },
);

Separator.displayName = "Separator";

export default Separator;
