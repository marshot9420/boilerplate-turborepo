"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

const cardVariants = cva(
  [
    "rounded-lg border border-border",
    "bg-surface text-surface-foreground",
    "transition-colors",
  ],
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      padding: "md",
    },
  },
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding, fullWidth, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-padding={padding ?? "md"}
        data-full-width={fullWidth ? "true" : "false"}
        className={cn(cardVariants({ padding, fullWidth }), className)}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export default Card;
