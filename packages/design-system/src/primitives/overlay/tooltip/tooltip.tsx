"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";

import { cn } from "../../../utils";

const tooltipContentVariants = cva(
  [
    "bg-foreground z-50 rounded-md px-3 py-1.5",
    "text-background text-xs shadow-md",
    "outline-none",
    "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
  ],
  {
    variants: {
      size: {
        sm: "max-w-48",
        md: "max-w-64",
        lg: "max-w-80",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = TooltipPrimitive.Root;

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipPortal = TooltipPrimitive.Portal;

export type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipContentVariants>;

export const TooltipContent = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, size, sideOffset = 4, ...props }, ref) => {
  return (
    <TooltipPortal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        data-size={size ?? "md"}
        className={cn(tooltipContentVariants({ size }), className)}
        {...props}
      />
    </TooltipPortal>
  );
});

TooltipContent.displayName = "TooltipContent";

export type TooltipArrowProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>;

export const TooltipArrow = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Arrow>,
  TooltipArrowProps
>(({ className, ...props }, ref) => {
  return (
    <TooltipPrimitive.Arrow ref={ref} className={cn("fill-foreground", className)} {...props} />
  );
});

TooltipArrow.displayName = "TooltipArrow";
