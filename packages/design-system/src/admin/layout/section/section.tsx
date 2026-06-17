"use client";

import { forwardRef } from "react";

import {
  Section as PrimitiveSection,
  type SectionProps as PrimitiveSectionProps,
} from "../../../primitives/layout/section";
import { cn } from "../../../utils";

export type SectionProps = PrimitiveSectionProps;

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "md", surface = "none", border = false, ...props }, ref) => {
    return (
      <PrimitiveSection
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
