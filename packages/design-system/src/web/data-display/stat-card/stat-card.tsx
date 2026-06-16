"use client";

import { cva } from "class-variance-authority";

import { forwardRef } from "react";

import {
  StatCard as PrimitiveStatCard,
  StatCardDescription as PrimitiveStatCardDescription,
  StatCardFooter as PrimitiveStatCardFooter,
  StatCardHeader as PrimitiveStatCardHeader,
  StatCardTitle as PrimitiveStatCardTitle,
  StatCardTrend as PrimitiveStatCardTrend,
  StatCardValue as PrimitiveStatCardValue,
  type StatCardDescriptionProps as PrimitiveStatCardDescriptionProps,
  type StatCardFooterProps as PrimitiveStatCardFooterProps,
  type StatCardHeaderProps as PrimitiveStatCardHeaderProps,
  type StatCardProps as PrimitiveStatCardProps,
  type StatCardTitleProps as PrimitiveStatCardTitleProps,
  type StatCardTrendProps as PrimitiveStatCardTrendProps,
  type StatCardValueProps as PrimitiveStatCardValueProps,
} from "../../../primitives/data-display/stat-card";
import { cn } from "../../../utils";

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

export type StatCardProps = PrimitiveStatCardProps;
export type StatCardHeaderProps = PrimitiveStatCardHeaderProps;
export type StatCardTitleProps = PrimitiveStatCardTitleProps;
export type StatCardValueProps = PrimitiveStatCardValueProps;
export type StatCardDescriptionProps = PrimitiveStatCardDescriptionProps;
export type StatCardTrendProps = PrimitiveStatCardTrendProps;
export type StatCardFooterProps = PrimitiveStatCardFooterProps;

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, tone = "default", interactive = false, ...props }, ref) => {
    return (
      <PrimitiveStatCard
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
      <PrimitiveStatCardHeader
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
      <PrimitiveStatCardTitle
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
      <PrimitiveStatCardValue
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
      <PrimitiveStatCardDescription
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
      <PrimitiveStatCardTrend
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
      <PrimitiveStatCardFooter
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
