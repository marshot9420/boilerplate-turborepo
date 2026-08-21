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

const dialogOverlayVariants = cva([
  "fixed inset-0 z-50",
  "bg-overlay/50",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
]);

const dialogContentVariants = cva(
  [
    "fixed top-1/2 left-1/2 z-50",
    "grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4",
    "border-border bg-surface text-surface-foreground rounded-lg border p-6 shadow-lg",
    "outline-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
  ],
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const dialogHeaderVariants = cva("grid gap-1.5 text-center sm:text-left");

const dialogFooterVariants = cva("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end");

const dialogTitleVariants = cva("text-lg leading-none font-semibold");

const dialogDescriptionVariants = cva("text-muted-foreground text-sm");

const BaseDialog = DialogPrimitive.Root;

const BaseDialogTrigger = DialogPrimitive.Trigger;

const BaseDialogClose = DialogPrimitive.Close;

const BaseDialogPortal = DialogPrimitive.Portal;

export type DialogOverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

const BaseDialogOverlay = forwardRef<
  ComponentRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(dialogOverlayVariants(), className)}
      {...props}
    />
  );
});

BaseDialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps
  extends
    ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {}

const BaseDialogContent = forwardRef<
  ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size, ...props }, ref) => {
  return (
    <BaseDialogPortal>
      <BaseDialogOverlay />

      <DialogPrimitive.Content
        ref={ref}
        data-size={size ?? "md"}
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </BaseDialogPortal>
  );
});

BaseDialogContent.displayName = "DialogContent";

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

const BaseDialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(dialogHeaderVariants(), className)} {...props} />;
  },
);

BaseDialogHeader.displayName = "DialogHeader";

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

const BaseDialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(dialogFooterVariants(), className)} {...props} />;
  },
);

BaseDialogFooter.displayName = "DialogFooter";

export type DialogTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

const BaseDialogTitle = forwardRef<ComponentRef<typeof DialogPrimitive.Title>, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <DialogPrimitive.Title
        ref={ref}
        className={cn(dialogTitleVariants(), className)}
        {...props}
      />
    );
  },
);

BaseDialogTitle.displayName = "DialogTitle";

export type DialogDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

const BaseDialogDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(dialogDescriptionVariants(), className)}
      {...props}
    />
  );
});

BaseDialogDescription.displayName = "DialogDescription";

const Dialog = BaseDialog;

const DialogTrigger = BaseDialogTrigger;

const DialogClose = BaseDialogClose;

const DialogPortal = BaseDialogPortal;

export const DialogOverlay = forwardRef<ComponentRef<typeof BaseDialogOverlay>, DialogOverlayProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseDialogOverlay
        ref={ref}
        className={cn("bg-overlay/50 backdrop-blur-[1px]", className)}
        {...props}
      />
    );
  },
);

DialogOverlay.displayName = "DialogOverlay";

export const DialogContent = forwardRef<ComponentRef<typeof BaseDialogContent>, DialogContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseDialogContent
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

DialogContent.displayName = "DialogContent";

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return <BaseDialogHeader ref={ref} className={cn("gap-2", className)} {...props} />;
  },
);

DialogHeader.displayName = "DialogHeader";

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => {
    return <BaseDialogFooter ref={ref} className={cn("pt-2", className)} {...props} />;
  },
);

DialogFooter.displayName = "DialogFooter";

export const DialogTitle = forwardRef<ComponentRef<typeof BaseDialogTitle>, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    return <BaseDialogTitle ref={ref} className={cn("tracking-tight", className)} {...props} />;
  },
);

DialogTitle.displayName = "DialogTitle";

export const DialogDescription = forwardRef<
  ComponentRef<typeof BaseDialogDescription>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => {
  return <BaseDialogDescription ref={ref} className={cn("leading-6", className)} {...props} />;
});

DialogDescription.displayName = "DialogDescription";

export default Dialog;

export { DialogClose, DialogPortal, DialogTrigger };
