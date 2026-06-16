"use client";

import { cva } from "class-variance-authority";

import { forwardRef } from "react";

import {
  Accordion as PrimitiveAccordion,
  AccordionContent as PrimitiveAccordionContent,
  AccordionItem as PrimitiveAccordionItem,
  AccordionTrigger as PrimitiveAccordionTrigger,
  type AccordionContentProps as PrimitiveAccordionContentProps,
  type AccordionItemProps as PrimitiveAccordionItemProps,
  type AccordionProps as PrimitiveAccordionProps,
  type AccordionTriggerProps as PrimitiveAccordionTriggerProps,
} from "../../../primitives/disclosure/accordion";
import { cn } from "../../../utils";

const accordionClasses = cva(["rounded-2xl", "border", "border-border", "bg-surface", "shadow-sm"]);

const accordionItemClasses = cva(["px-5", "last:border-b-0"]);

const accordionTriggerClasses = cva([
  "py-5",
  "text-base",
  "font-semibold",
  "text-foreground",
  "motion-reduce:transition-none",
]);

const accordionContentClasses = cva(["text-sm", "leading-6"]);

export type AccordionProps = PrimitiveAccordionProps;
export type AccordionItemProps = PrimitiveAccordionItemProps;
export type AccordionTriggerProps = PrimitiveAccordionTriggerProps;
export type AccordionContentProps = PrimitiveAccordionContentProps;

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(({ className, ...props }, ref) => {
  return (
    <PrimitiveAccordion
      ref={ref}
      className={cn(accordionClasses(), className)}
      {...props}
      data-ds-component="accordion"
    />
  );
});

Accordion.displayName = "Accordion";

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveAccordionItem
        ref={ref}
        className={cn(accordionItemClasses(), className)}
        {...props}
        data-ds-component="accordion-item"
      />
    );
  },
);

AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveAccordionTrigger
        ref={ref}
        className={cn(accordionTriggerClasses(), className)}
        {...props}
        data-ds-component="accordion-trigger"
      />
    );
  },
);

AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveAccordionContent
        ref={ref}
        className={cn(accordionContentClasses(), className)}
        {...props}
        data-ds-component="accordion-content"
      />
    );
  },
);

AccordionContent.displayName = "AccordionContent";

export default Accordion;
