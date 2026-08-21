"use client";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

export type SectionSpacing = "none" | "sm" | "md" | "lg" | "xl";

export type SectionSurface = "none" | "background" | "surface" | "muted";

export interface BaseSectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: SectionSpacing;
  surface?: SectionSurface;
  border?: boolean;
}

const BaseSection = forwardRef<HTMLElement, BaseSectionProps>(
  ({ className, spacing = "lg", surface = "none", border = false, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "w-full",
          spacing === "sm" && "py-6",
          spacing === "md" && "py-10",
          spacing === "lg" && "py-14 sm:py-16",
          spacing === "xl" && "py-20 sm:py-24",
          surface === "background" && "bg-background text-foreground",
          surface === "surface" && "bg-surface text-surface-foreground",
          surface === "muted" && "bg-muted text-foreground",
          border && "border-border border-y",
          className,
        )}
        data-spacing={spacing}
        data-surface={surface}
        data-border={border ? "true" : "false"}
        {...props}
      />
    );
  },
);

BaseSection.displayName = "Section";

export type SectionProps = BaseSectionProps;

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "lg", surface = "none", border = false, ...props }, ref) => {
    return (
      <BaseSection
        ref={ref}
        spacing={spacing}
        surface={surface}
        border={border}
        className={cn("min-w-0", className)}
        {...props}
      />
    );
  },
);

Section.displayName = "Section";

export default Section;
