"use client";

import { forwardRef, type ComponentRef } from "react";

import {
  Popover as PrimitivePopover,
  PopoverAnchor as PrimitivePopoverAnchor,
  PopoverClose as PrimitivePopoverClose,
  PopoverContent as PrimitivePopoverContent,
  PopoverPortal as PrimitivePopoverPortal,
  PopoverTrigger as PrimitivePopoverTrigger,
  type PopoverContentProps,
} from "../../../primitives/overlay/popover";
import { cn } from "../../../utils";

const Popover = PrimitivePopover;
const PopoverTrigger = PrimitivePopoverTrigger;
const PopoverAnchor = PrimitivePopoverAnchor;
const PopoverClose = PrimitivePopoverClose;
const PopoverPortal = PrimitivePopoverPortal;

export const PopoverContent = forwardRef<
  ComponentRef<typeof PrimitivePopoverContent>,
  PopoverContentProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitivePopoverContent
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
export type { PopoverContentProps };
