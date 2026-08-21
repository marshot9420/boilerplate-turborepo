"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

const baseCardVariants = cva(
  ["border-border rounded-lg border", "bg-surface text-surface-foreground", "transition-colors"],
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

export interface BaseCardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof baseCardVariants> {}

const BaseCard = forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, padding, fullWidth, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-padding={padding ?? "md"}
        data-full-width={fullWidth ? "true" : "false"}
        className={cn(baseCardVariants({ padding, fullWidth }), className)}
        {...props}
      />
    );
  },
);

BaseCard.displayName = "Card";

const cardVariants = cva(["overflow-hidden", "rounded-xl"], {
  variants: {
    variant: {
      default: "border-border/80 shadow-sm",
      muted: "bg-muted/50 border-transparent shadow-none",
      elevated: "border-transparent shadow-md",
      outline: "bg-background shadow-none",
    },
    interactive: {
      true: [
        "cursor-pointer",
        "md:hover:border-primary/30 md:hover:shadow-md",
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

export interface CardProps extends BaseCardProps, VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive = false, ...props }, ref) => {
    return (
      <BaseCard
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
