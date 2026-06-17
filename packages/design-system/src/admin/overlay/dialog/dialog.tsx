"use client";

import { forwardRef, type ComponentRef } from "react";

import {
  Dialog as PrimitiveDialog,
  DialogClose as PrimitiveDialogClose,
  DialogContent as PrimitiveDialogContent,
  DialogDescription as PrimitiveDialogDescription,
  DialogFooter as PrimitiveDialogFooter,
  DialogHeader as PrimitiveDialogHeader,
  DialogOverlay as PrimitiveDialogOverlay,
  DialogPortal as PrimitiveDialogPortal,
  DialogTitle as PrimitiveDialogTitle,
  DialogTrigger as PrimitiveDialogTrigger,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogFooterProps,
  type DialogHeaderProps,
  type DialogOverlayProps,
  type DialogTitleProps,
} from "../../../primitives/overlay/dialog";
import { cn } from "../../../utils";

const Dialog = PrimitiveDialog;
const DialogTrigger = PrimitiveDialogTrigger;
const DialogClose = PrimitiveDialogClose;
const DialogPortal = PrimitiveDialogPortal;

export const DialogOverlay = forwardRef<
  ComponentRef<typeof PrimitiveDialogOverlay>,
  DialogOverlayProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveDialogOverlay
      ref={ref}
      className={cn("bg-black/55 backdrop-blur-[1px]", className)}
      {...props}
    />
  );
});

DialogOverlay.displayName = "DialogOverlay";

export const DialogContent = forwardRef<
  ComponentRef<typeof PrimitiveDialogContent>,
  DialogContentProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveDialogContent
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

DialogContent.displayName = "DialogContent";

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveDialogHeader ref={ref} className={cn("gap-2", className)} {...props} />;
  },
);

DialogHeader.displayName = "DialogHeader";

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveDialogFooter ref={ref} className={cn("pt-2", className)} {...props} />;
  },
);

DialogFooter.displayName = "DialogFooter";

export const DialogTitle = forwardRef<ComponentRef<typeof PrimitiveDialogTitle>, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveDialogTitle ref={ref} className={cn("tracking-tight", className)} {...props} />
    );
  },
);

DialogTitle.displayName = "DialogTitle";

export const DialogDescription = forwardRef<
  ComponentRef<typeof PrimitiveDialogDescription>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => {
  return <PrimitiveDialogDescription ref={ref} className={cn("leading-6", className)} {...props} />;
});

DialogDescription.displayName = "DialogDescription";

export default Dialog;
export { DialogClose, DialogPortal, DialogTrigger };
export type {
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogOverlayProps,
  DialogTitleProps,
};
