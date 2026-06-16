"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";

import { cn } from "../../../utils";

const popoverContentVariants = cva(
  [
    "border-border z-50 rounded-md border",
    "bg-surface text-surface-foreground p-4 shadow-lg",
    "outline-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
  ],
  {
    variants: {
      size: {
        sm: "w-56",
        md: "w-72",
        lg: "w-96",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const Popover = PopoverPrimitive.Root;

export const PopoverTrigger = PopoverPrimitive.Trigger;

export const PopoverAnchor = PopoverPrimitive.Anchor;

export const PopoverClose = PopoverPrimitive.Close;

export const PopoverPortal = PopoverPrimitive.Portal;

export type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
  VariantProps<typeof popoverContentVariants>;

export const PopoverContent = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ className, size, sideOffset = 4, ...props }, ref) => {
  return (
    <PopoverPortal>
      <PopoverPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        data-size={size ?? "md"}
        className={cn(popoverContentVariants({ size }), className)}
        {...props}
      />
    </PopoverPortal>
  );
});

PopoverContent.displayName = "PopoverContent";
