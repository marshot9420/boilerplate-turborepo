"use client";

import { forwardRef, type ComponentRef } from "react";

import {
  Tooltip as PrimitiveTooltip,
  TooltipArrow as PrimitiveTooltipArrow,
  TooltipContent as PrimitiveTooltipContent,
  TooltipPortal as PrimitiveTooltipPortal,
  TooltipProvider as PrimitiveTooltipProvider,
  TooltipTrigger as PrimitiveTooltipTrigger,
  type TooltipArrowProps,
  type TooltipContentProps,
} from "../../../primitives/overlay/tooltip";
import { cn } from "../../../utils";

const TooltipProvider = PrimitiveTooltipProvider;
const Tooltip = PrimitiveTooltip;
const TooltipTrigger = PrimitiveTooltipTrigger;
const TooltipPortal = PrimitiveTooltipPortal;

export const TooltipContent = forwardRef<
  ComponentRef<typeof PrimitiveTooltipContent>,
  TooltipContentProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveTooltipContent
      ref={ref}
      className={cn("bg-foreground shadow-lg", className)}
      {...props}
    />
  );
});

TooltipContent.displayName = "TooltipContent";

export const TooltipArrow = forwardRef<
  ComponentRef<typeof PrimitiveTooltipArrow>,
  TooltipArrowProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveTooltipArrow ref={ref} className={cn("fill-foreground", className)} {...props} />
  );
});

TooltipArrow.displayName = "TooltipArrow";

export default Tooltip;
export { TooltipPortal, TooltipProvider, TooltipTrigger };
export type { TooltipArrowProps, TooltipContentProps };
