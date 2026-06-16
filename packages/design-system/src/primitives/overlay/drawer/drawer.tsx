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
  "bg-black/50",
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

export const Drawer = DialogPrimitive.Root;

export const DrawerTrigger = DialogPrimitive.Trigger;

export const DrawerClose = DialogPrimitive.Close;

export const DrawerPortal = DialogPrimitive.Portal;

export type DrawerOverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

export const DrawerOverlay = forwardRef<
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

DrawerOverlay.displayName = "DrawerOverlay";

export interface DrawerContentProps
  extends
    ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerContentVariants> {}

export const DrawerContent = forwardRef<
  ComponentRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, children, side, size, ...props }, ref) => {
  return (
    <DrawerPortal>
      <DrawerOverlay />

      <DialogPrimitive.Content
        ref={ref}
        data-side={side ?? "right"}
        data-size={size ?? "md"}
        className={cn(drawerContentVariants({ side, size }), className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DrawerPortal>
  );
});

DrawerContent.displayName = "DrawerContent";

export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(drawerHeaderVariants(), className)} {...props} />;
  },
);

DrawerHeader.displayName = "DrawerHeader";

export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(drawerFooterVariants(), className)} {...props} />;
  },
);

DrawerFooter.displayName = "DrawerFooter";

export type DrawerTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

export const DrawerTitle = forwardRef<ComponentRef<typeof DialogPrimitive.Title>, DrawerTitleProps>(
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

DrawerTitle.displayName = "DrawerTitle";

export type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

export const DrawerDescription = forwardRef<
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

DrawerDescription.displayName = "DrawerDescription";
