"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva } from "class-variance-authority";

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";

import { cn } from "../../../utils";

export type BaseAccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

const BaseAccordion = AccordionPrimitive.Root;

export type BaseAccordionItemProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

const BaseAccordionItem = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Item>,
  BaseAccordionItemProps
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn("border-border border-b", className)}
      {...props}
    />
  );
});

BaseAccordionItem.displayName = "AccordionItem";

export interface BaseAccordionTriggerProps extends ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> {
  rightSlot?: ReactNode;
}

const BaseAccordionTrigger = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Trigger>,
  BaseAccordionTriggerProps
>(({ className, children, rightSlot, disabled, ...props }, ref) => {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "group flex flex-1 items-center justify-between gap-3 py-4 text-left text-sm font-medium transition-colors",
          "hover:text-foreground",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        disabled={disabled}
        data-disabled={disabled ? "true" : "false"}
        {...props}
      >
        <span>{children}</span>

        {rightSlot ? (
          <span
            className="shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          >
            {rightSlot}
          </span>
        ) : null}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

BaseAccordionTrigger.displayName = "AccordionTrigger";

export type BaseAccordionContentProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>;

const BaseAccordionContent = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Content>,
  BaseAccordionContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "text-muted-foreground overflow-hidden text-sm data-[state=closed]:hidden",
        className,
      )}
      {...props}
    >
      <div className="pt-0 pb-4">{children}</div>
    </AccordionPrimitive.Content>
  );
});

BaseAccordionContent.displayName = "AccordionContent";

const accordionClasses = cva([
  "rounded-lg",
  "border",
  "border-border",
  "bg-surface",
  "shadow-none",
]);

const accordionItemClasses = cva(["px-4", "last:border-b-0"]);

const accordionTriggerClasses = cva([
  "py-3.5",
  "text-sm",
  "font-semibold",
  "text-foreground",
  "motion-reduce:transition-none",
]);

const accordionContentClasses = cva(["text-sm", "leading-6"]);

export type AccordionProps = BaseAccordionProps;

export type AccordionItemProps = BaseAccordionItemProps;

export type AccordionTriggerProps = BaseAccordionTriggerProps;

export type AccordionContentProps = BaseAccordionContentProps;

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(({ className, ...props }, ref) => {
  return (
    <BaseAccordion
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
      <BaseAccordionItem
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
      <BaseAccordionTrigger
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
      <BaseAccordionContent
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
