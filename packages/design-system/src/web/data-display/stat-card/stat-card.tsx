"use client";

import { cva } from "class-variance-authority";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

export type StatCardSize = "sm" | "md" | "lg";

export type StatCardTone = "default" | "muted" | "success" | "warning" | "danger" | "info";

export interface BaseStatCardProps extends HTMLAttributes<HTMLDivElement> {
  size?: StatCardSize;
  tone?: StatCardTone;
  interactive?: boolean;
}

const BaseStatCard = forwardRef<HTMLDivElement, BaseStatCardProps>(
  ({ className, size = "md", tone = "default", interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-border bg-surface text-surface-foreground rounded-lg border shadow-sm",
          size === "sm" && "p-4",
          size === "md" && "p-5",
          size === "lg" && "p-6",
          tone === "muted" && "bg-muted",
          interactive &&
            "hover:bg-muted/50 focus-visible:ring-ring transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
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

BaseStatCard.displayName = "StatCard";

export type BaseStatCardHeaderProps = HTMLAttributes<HTMLDivElement>;

const BaseStatCardHeader = forwardRef<HTMLDivElement, BaseStatCardHeaderProps>(
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

BaseStatCardHeader.displayName = "StatCardHeader";

export type BaseStatCardTitleProps = HTMLAttributes<HTMLHeadingElement>;

const BaseStatCardTitle = forwardRef<HTMLHeadingElement, BaseStatCardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-muted-foreground text-sm font-medium", className)}
        {...props}
      />
    );
  },
);

BaseStatCardTitle.displayName = "StatCardTitle";

export type BaseStatCardValueProps = HTMLAttributes<HTMLParagraphElement>;

const BaseStatCardValue = forwardRef<HTMLParagraphElement, BaseStatCardValueProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("mt-2 text-2xl font-semibold tracking-tight", className)}
        {...props}
      />
    );
  },
);

BaseStatCardValue.displayName = "StatCardValue";

export type BaseStatCardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

const BaseStatCardDescription = forwardRef<HTMLParagraphElement, BaseStatCardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn("text-muted-foreground mt-1 text-sm", className)} {...props} />
    );
  },
);

BaseStatCardDescription.displayName = "StatCardDescription";

export interface BaseStatCardTrendProps extends HTMLAttributes<HTMLSpanElement> {
  direction?: "up" | "down" | "flat";
}

const BaseStatCardTrend = forwardRef<HTMLSpanElement, BaseStatCardTrendProps>(
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

BaseStatCardTrend.displayName = "StatCardTrend";

export type BaseStatCardFooterProps = HTMLAttributes<HTMLDivElement>;

const BaseStatCardFooter = forwardRef<HTMLDivElement, BaseStatCardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mt-4 flex items-center gap-2 text-sm", className)} {...props} />
    );
  },
);

BaseStatCardFooter.displayName = "StatCardFooter";

const statCardClasses = cva(["rounded-2xl", "shadow-sm", "motion-reduce:transition-none"], {
  variants: {
    tone: {
      default: "bg-surface",
      muted: "bg-muted/70",
      success: "border-success/25 bg-success/5",
      warning: "border-warning/30 bg-warning/10",
      danger: "border-destructive/25 bg-destructive/5",
      info: "border-info/25 bg-info/5",
    },
    interactive: {
      true: "hover:-translate-y-0.5 hover:shadow-md",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

const statCardHeaderClasses = cva(["items-start"]);

const statCardTitleClasses = cva(["leading-6"]);

const statCardValueClasses = cva(["text-3xl", "font-bold", "tracking-tight"]);

const statCardDescriptionClasses = cva(["leading-6"]);

const statCardTrendClasses = cva(["shadow-sm"]);

const statCardFooterClasses = cva(["text-muted-foreground"]);

export type StatCardProps = BaseStatCardProps;

export type StatCardHeaderProps = BaseStatCardHeaderProps;

export type StatCardTitleProps = BaseStatCardTitleProps;

export type StatCardValueProps = BaseStatCardValueProps;

export type StatCardDescriptionProps = BaseStatCardDescriptionProps;

export type StatCardTrendProps = BaseStatCardTrendProps;

export type StatCardFooterProps = BaseStatCardFooterProps;

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, tone = "default", interactive = false, ...props }, ref) => {
    return (
      <BaseStatCard
        ref={ref}
        tone={tone}
        interactive={interactive}
        className={cn(statCardClasses({ tone, interactive }), className)}
        data-ds-component="stat-card"
        {...props}
      />
    );
  },
);

StatCard.displayName = "StatCard";

export const StatCardHeader = forwardRef<HTMLDivElement, StatCardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseStatCardHeader
        ref={ref}
        className={cn(statCardHeaderClasses(), className)}
        data-ds-component="stat-card-header"
        {...props}
      />
    );
  },
);

StatCardHeader.displayName = "StatCardHeader";

export const StatCardTitle = forwardRef<HTMLHeadingElement, StatCardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseStatCardTitle
        ref={ref}
        className={cn(statCardTitleClasses(), className)}
        data-ds-component="stat-card-title"
        {...props}
      />
    );
  },
);

StatCardTitle.displayName = "StatCardTitle";

export const StatCardValue = forwardRef<HTMLParagraphElement, StatCardValueProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseStatCardValue
        ref={ref}
        className={cn(statCardValueClasses(), className)}
        data-ds-component="stat-card-value"
        {...props}
      />
    );
  },
);

StatCardValue.displayName = "StatCardValue";

export const StatCardDescription = forwardRef<HTMLParagraphElement, StatCardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseStatCardDescription
        ref={ref}
        className={cn(statCardDescriptionClasses(), className)}
        data-ds-component="stat-card-description"
        {...props}
      />
    );
  },
);

StatCardDescription.displayName = "StatCardDescription";

export const StatCardTrend = forwardRef<HTMLSpanElement, StatCardTrendProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseStatCardTrend
        ref={ref}
        className={cn(statCardTrendClasses(), className)}
        data-ds-component="stat-card-trend"
        {...props}
      />
    );
  },
);

StatCardTrend.displayName = "StatCardTrend";

export const StatCardFooter = forwardRef<HTMLDivElement, StatCardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseStatCardFooter
        ref={ref}
        className={cn(statCardFooterClasses(), className)}
        data-ds-component="stat-card-footer"
        {...props}
      />
    );
  },
);

StatCardFooter.displayName = "StatCardFooter";

export default StatCard;
