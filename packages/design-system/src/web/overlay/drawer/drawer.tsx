"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
} from "react";

import { cn } from "../../../utils";

const drawerOverlayVariants = cva([
  "fixed inset-0 z-50",
  "bg-overlay/50",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
]);

const drawerContentVariants = cva(
  [
    "fixed z-50",
    "border-border bg-surface text-surface-foreground grid gap-4 p-6 shadow-lg",
    "outline-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
  ],
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b",
        right: "inset-y-0 right-0 h-full border-l",
        bottom: "inset-x-0 bottom-0 border-t",
        left: "inset-y-0 left-0 h-full border-r",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    compoundVariants: [
      {
        side: ["left", "right"],
        size: "sm",
        className: "w-72",
      },
      {
        side: ["left", "right"],
        size: "md",
        className: "w-80 sm:w-96",
      },
      {
        side: ["left", "right"],
        size: "lg",
        className: "w-[calc(100%-2rem)] sm:w-[32rem]",
      },
      {
        side: ["top", "bottom"],
        size: "sm",
        className: "max-h-64",
      },
      {
        side: ["top", "bottom"],
        size: "md",
        className: "max-h-80",
      },
      {
        side: ["top", "bottom"],
        size: "lg",
        className: "max-h-[calc(100%-2rem)]",
      },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
    },
  },
);

const drawerHeaderVariants = cva("grid gap-1.5 text-left");

const drawerFooterVariants = cva("mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end");

const drawerTitleVariants = cva("text-lg leading-none font-semibold");

const drawerDescriptionVariants = cva("text-muted-foreground text-sm");

const BaseDrawer = DialogPrimitive.Root;

const BaseDrawerTrigger = DialogPrimitive.Trigger;

const BaseDrawerClose = DialogPrimitive.Close;

const BaseDrawerPortal = DialogPrimitive.Portal;

export type DrawerOverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

const BaseDrawerOverlay = forwardRef<
  ComponentRef<typeof DialogPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(drawerOverlayVariants(), className)}
      {...props}
    />
  );
});

BaseDrawerOverlay.displayName = "DrawerOverlay";

export interface DrawerContentProps
  extends
    ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerContentVariants> {}

const BaseDrawerContent = forwardRef<
  ComponentRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, children, side, size, ...props }, ref) => {
  return (
    <BaseDrawerPortal>
      <BaseDrawerOverlay />

      <DialogPrimitive.Content
        ref={ref}
        data-side={side ?? "right"}
        data-size={size ?? "md"}
        className={cn(drawerContentVariants({ side, size }), className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </BaseDrawerPortal>
  );
});

BaseDrawerContent.displayName = "DrawerContent";

export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>;

const BaseDrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(drawerHeaderVariants(), className)} {...props} />;
  },
);

BaseDrawerHeader.displayName = "DrawerHeader";

export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;

const BaseDrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(drawerFooterVariants(), className)} {...props} />;
  },
);

BaseDrawerFooter.displayName = "DrawerFooter";

export type DrawerTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

const BaseDrawerTitle = forwardRef<ComponentRef<typeof DialogPrimitive.Title>, DrawerTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <DialogPrimitive.Title
        ref={ref}
        className={cn(drawerTitleVariants(), className)}
        {...props}
      />
    );
  },
);

BaseDrawerTitle.displayName = "DrawerTitle";

export type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

const BaseDrawerDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(drawerDescriptionVariants(), className)}
      {...props}
    />
  );
});

BaseDrawerDescription.displayName = "DrawerDescription";

const Drawer = BaseDrawer;

const DrawerTrigger = BaseDrawerTrigger;

const DrawerClose = BaseDrawerClose;

const DrawerPortal = BaseDrawerPortal;

export const DrawerOverlay = forwardRef<ComponentRef<typeof BaseDrawerOverlay>, DrawerOverlayProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseDrawerOverlay
        ref={ref}
        className={cn("bg-overlay/50 backdrop-blur-[1px]", className)}
        {...props}
      />
    );
  },
);

DrawerOverlay.displayName = "DrawerOverlay";

export const DrawerContent = forwardRef<ComponentRef<typeof BaseDrawerContent>, DrawerContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseDrawerContent
        ref={ref}
        className={cn(
          "bg-surface shadow-xl",
          "focus-visible:outline-ring focus-visible:outline-2",
          className,
        )}
        {...props}
      />
    );
  },
);

DrawerContent.displayName = "DrawerContent";

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, ...props }, ref) => {
    return <BaseDrawerHeader ref={ref} className={cn("gap-2", className)} {...props} />;
  },
);

DrawerHeader.displayName = "DrawerHeader";

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, ...props }, ref) => {
    return <BaseDrawerFooter ref={ref} className={cn("pt-2", className)} {...props} />;
  },
);

DrawerFooter.displayName = "DrawerFooter";

export const DrawerTitle = forwardRef<ComponentRef<typeof BaseDrawerTitle>, DrawerTitleProps>(
  ({ className, ...props }, ref) => {
    return <BaseDrawerTitle ref={ref} className={cn("tracking-tight", className)} {...props} />;
  },
);

DrawerTitle.displayName = "DrawerTitle";

export const DrawerDescription = forwardRef<
  ComponentRef<typeof BaseDrawerDescription>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => {
  return <BaseDrawerDescription ref={ref} className={cn("leading-6", className)} {...props} />;
});

DrawerDescription.displayName = "DrawerDescription";

export default Drawer;

export { DrawerClose, DrawerPortal, DrawerTrigger };
