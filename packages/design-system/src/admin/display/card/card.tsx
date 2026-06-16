"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef } from "react";

import {
  Card as PrimitiveCard,
  type CardProps as PrimitiveCardProps,
} from "../../../primitives/display/card";
import { cn } from "../../../utils";

const cardVariants = cva(["overflow-hidden", "shadow-sm"], {
  variants: {
    variant: {
      default: "shadow-sm",
      muted: "bg-muted/40 shadow-none",
      elevated: "shadow-md",
      outline: "bg-background shadow-none",
    },
    interactive: {
      true: [
        "cursor-pointer",
        "md:hover:border-primary/40 md:hover:shadow-md",
        "active:translate-y-px",
      ],
      false: null,
    },
  },
  defaultVariants: {
    variant: "default",
    interactive: false,
  },
});

export interface CardProps extends PrimitiveCardProps, VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive = false, ...props }, ref) => {
    return (
      <PrimitiveCard
        ref={ref}
        data-variant={variant ?? "default"}
        data-interactive={interactive ? "true" : "false"}
        className={cn(cardVariants({ variant, interactive }), className)}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export default Card;
