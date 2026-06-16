"use client";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

export type StatCardSize = "sm" | "md" | "lg";
export type StatCardTone =
  | "default"
  | "muted"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  size?: StatCardSize;
  tone?: StatCardTone;
  interactive?: boolean;
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    { className, size = "md", tone = "default", interactive = false, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border bg-surface text-surface-foreground shadow-sm",
          size === "sm" && "p-4",
          size === "md" && "p-5",
          size === "lg" && "p-6",
          tone === "muted" && "bg-muted",
          interactive &&
            "transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        )}
        data-size={size}
        data-tone={tone}
        data-interactive={interactive ? "true" : "false"}
        {...props}
      />
    );
  },
);

StatCard.displayName = "StatCard";

export type StatCardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const StatCardHeader = forwardRef<HTMLDivElement, StatCardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-start justify-between gap-3", className)}
        {...props}
      />
    );
  },
);

StatCardHeader.displayName = "StatCardHeader";

export type StatCardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const StatCardTitle = forwardRef<HTMLHeadingElement, StatCardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-sm font-medium text-muted-foreground", className)}
        {...props}
      />
    );
  },
);

StatCardTitle.displayName = "StatCardTitle";

export type StatCardValueProps = HTMLAttributes<HTMLParagraphElement>;

export const StatCardValue = forwardRef<
  HTMLParagraphElement,
  StatCardValueProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("mt-2 text-2xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
});

StatCardValue.displayName = "StatCardValue";

export type StatCardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const StatCardDescription = forwardRef<
  HTMLParagraphElement,
  StatCardDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("mt-1 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

StatCardDescription.displayName = "StatCardDescription";

export interface StatCardTrendProps extends HTMLAttributes<HTMLSpanElement> {
  direction?: "up" | "down" | "flat";
}

export const StatCardTrend = forwardRef<HTMLSpanElement, StatCardTrendProps>(
  ({ className, direction = "flat", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          direction === "up" && "bg-success text-success-foreground",
          direction === "down" && "bg-destructive text-destructive-foreground",
          direction === "flat" && "bg-muted text-muted-foreground",
          className,
        )}
        data-direction={direction}
        {...props}
      />
    );
  },
);

StatCardTrend.displayName = "StatCardTrend";

export type StatCardFooterProps = HTMLAttributes<HTMLDivElement>;

export const StatCardFooter = forwardRef<HTMLDivElement, StatCardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-4 flex items-center gap-2 text-sm", className)}
        {...props}
      />
    );
  },
);

StatCardFooter.displayName = "StatCardFooter";

export default StatCard;
