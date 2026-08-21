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

const BaseTooltipProvider = TooltipPrimitive.Provider;

const BaseTooltip = TooltipPrimitive.Root;

const BaseTooltipTrigger = TooltipPrimitive.Trigger;

const BaseTooltipPortal = TooltipPrimitive.Portal;

export type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipContentVariants>;

const BaseTooltipContent = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, size, sideOffset = 4, ...props }, ref) => {
  return (
    <BaseTooltipPortal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        data-size={size ?? "md"}
        className={cn(tooltipContentVariants({ size }), className)}
        {...props}
      />
    </BaseTooltipPortal>
  );
});

BaseTooltipContent.displayName = "TooltipContent";

export type TooltipArrowProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>;

const BaseTooltipArrow = forwardRef<ComponentRef<typeof TooltipPrimitive.Arrow>, TooltipArrowProps>(
  ({ className, ...props }, ref) => {
    return (
      <TooltipPrimitive.Arrow ref={ref} className={cn("fill-foreground", className)} {...props} />
    );
  },
);

BaseTooltipArrow.displayName = "TooltipArrow";

const TooltipProvider = BaseTooltipProvider;

const Tooltip = BaseTooltip;

const TooltipTrigger = BaseTooltipTrigger;

const TooltipPortal = BaseTooltipPortal;

export const TooltipContent = forwardRef<
  ComponentRef<typeof BaseTooltipContent>,
  TooltipContentProps
>(({ className, ...props }, ref) => {
  return (
    <BaseTooltipContent ref={ref} className={cn("bg-foreground shadow-lg", className)} {...props} />
  );
});

TooltipContent.displayName = "TooltipContent";

export const TooltipArrow = forwardRef<ComponentRef<typeof BaseTooltipArrow>, TooltipArrowProps>(
  ({ className, ...props }, ref) => {
    return <BaseTooltipArrow ref={ref} className={cn("fill-foreground", className)} {...props} />;
  },
);

TooltipArrow.displayName = "TooltipArrow";

export default Tooltip;

export { TooltipPortal, TooltipProvider, TooltipTrigger };
