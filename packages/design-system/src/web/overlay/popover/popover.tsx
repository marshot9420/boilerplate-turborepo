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

const BasePopover = PopoverPrimitive.Root;

const BasePopoverTrigger = PopoverPrimitive.Trigger;

const BasePopoverAnchor = PopoverPrimitive.Anchor;

const BasePopoverClose = PopoverPrimitive.Close;

const BasePopoverPortal = PopoverPrimitive.Portal;

export type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
  VariantProps<typeof popoverContentVariants>;

const BasePopoverContent = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ className, size, sideOffset = 4, ...props }, ref) => {
  return (
    <BasePopoverPortal>
      <PopoverPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        data-size={size ?? "md"}
        className={cn(popoverContentVariants({ size }), className)}
        {...props}
      />
    </BasePopoverPortal>
  );
});

BasePopoverContent.displayName = "PopoverContent";

const Popover = BasePopover;

const PopoverTrigger = BasePopoverTrigger;

const PopoverAnchor = BasePopoverAnchor;

const PopoverClose = BasePopoverClose;

const PopoverPortal = BasePopoverPortal;

export const PopoverContent = forwardRef<
  ComponentRef<typeof BasePopoverContent>,
  PopoverContentProps
>(({ className, ...props }, ref) => {
  return (
    <BasePopoverContent
      ref={ref}
      className={cn(
        "bg-surface shadow-xl",
        "focus-visible:outline-ring focus-visible:outline-2",
        className,
      )}
      {...props}
    />
  );
});

PopoverContent.displayName = "PopoverContent";

export default Popover;

export { PopoverAnchor, PopoverClose, PopoverPortal, PopoverTrigger };
