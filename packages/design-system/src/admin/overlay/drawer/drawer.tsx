"use client";

import { forwardRef, type ComponentRef } from "react";

import {
  Drawer as PrimitiveDrawer,
  DrawerClose as PrimitiveDrawerClose,
  DrawerContent as PrimitiveDrawerContent,
  DrawerDescription as PrimitiveDrawerDescription,
  DrawerFooter as PrimitiveDrawerFooter,
  DrawerHeader as PrimitiveDrawerHeader,
  DrawerOverlay as PrimitiveDrawerOverlay,
  DrawerPortal as PrimitiveDrawerPortal,
  DrawerTitle as PrimitiveDrawerTitle,
  DrawerTrigger as PrimitiveDrawerTrigger,
  type DrawerContentProps,
  type DrawerDescriptionProps,
  type DrawerFooterProps,
  type DrawerHeaderProps,
  type DrawerOverlayProps,
  type DrawerTitleProps,
} from "../../../primitives/overlay/drawer";
import { cn } from "../../../utils";

const Drawer = PrimitiveDrawer;
const DrawerTrigger = PrimitiveDrawerTrigger;
const DrawerClose = PrimitiveDrawerClose;
const DrawerPortal = PrimitiveDrawerPortal;

export const DrawerOverlay = forwardRef<
  ComponentRef<typeof PrimitiveDrawerOverlay>,
  DrawerOverlayProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveDrawerOverlay
      ref={ref}
      className={cn("bg-black/55 backdrop-blur-[1px]", className)}
      {...props}
    />
  );
});

DrawerOverlay.displayName = "DrawerOverlay";

export const DrawerContent = forwardRef<
  ComponentRef<typeof PrimitiveDrawerContent>,
  DrawerContentProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveDrawerContent
      ref={ref}
      className={cn(
        "bg-surface/95 shadow-xl",
        "focus-visible:outline-ring focus-visible:outline-2",
        className,
      )}
      {...props}
    />
  );
});

DrawerContent.displayName = "DrawerContent";

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveDrawerHeader ref={ref} className={cn("gap-2", className)} {...props} />;
  },
);

DrawerHeader.displayName = "DrawerHeader";

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveDrawerFooter ref={ref} className={cn("pt-2", className)} {...props} />;
  },
);

DrawerFooter.displayName = "DrawerFooter";

export const DrawerTitle = forwardRef<ComponentRef<typeof PrimitiveDrawerTitle>, DrawerTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveDrawerTitle ref={ref} className={cn("tracking-tight", className)} {...props} />
    );
  },
);

DrawerTitle.displayName = "DrawerTitle";

export const DrawerDescription = forwardRef<
  ComponentRef<typeof PrimitiveDrawerDescription>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => {
  return <PrimitiveDrawerDescription ref={ref} className={cn("leading-6", className)} {...props} />;
});

DrawerDescription.displayName = "DrawerDescription";

export default Drawer;
export { DrawerClose, DrawerPortal, DrawerTrigger };
export type {
  DrawerContentProps,
  DrawerDescriptionProps,
  DrawerFooterProps,
  DrawerHeaderProps,
  DrawerOverlayProps,
  DrawerTitleProps,
};
