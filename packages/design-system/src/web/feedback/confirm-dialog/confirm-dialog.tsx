"use client";

import { forwardRef } from "react";

import {
  ConfirmDialog as PrimitiveConfirmDialog,
  ConfirmDialogAction as PrimitiveConfirmDialogAction,
  type ConfirmDialogActionProps as PrimitiveConfirmDialogActionProps,
  ConfirmDialogCancel as PrimitiveConfirmDialogCancel,
  type ConfirmDialogCancelProps as PrimitiveConfirmDialogCancelProps,
  ConfirmDialogContent as PrimitiveConfirmDialogContent,
  type ConfirmDialogContentProps as PrimitiveConfirmDialogContentProps,
  ConfirmDialogDescription as PrimitiveConfirmDialogDescription,
  type ConfirmDialogDescriptionProps as PrimitiveConfirmDialogDescriptionProps,
  ConfirmDialogFooter as PrimitiveConfirmDialogFooter,
  type ConfirmDialogFooterProps as PrimitiveConfirmDialogFooterProps,
  ConfirmDialogHeader as PrimitiveConfirmDialogHeader,
  type ConfirmDialogHeaderProps as PrimitiveConfirmDialogHeaderProps,
  ConfirmDialogOverlay as PrimitiveConfirmDialogOverlay,
  type ConfirmDialogOverlayProps as PrimitiveConfirmDialogOverlayProps,
  ConfirmDialogPortal as PrimitiveConfirmDialogPortal,
  type ConfirmDialogPortalProps,
  type ConfirmDialogProps,
  ConfirmDialogTitle as PrimitiveConfirmDialogTitle,
  type ConfirmDialogTitleProps as PrimitiveConfirmDialogTitleProps,
  ConfirmDialogTrigger as PrimitiveConfirmDialogTrigger,
  type ConfirmDialogTriggerProps,
} from "../../../primitives/feedback/confirm-dialog";
import { cn } from "../../../utils";

const ConfirmDialog = PrimitiveConfirmDialog;

export const ConfirmDialogTrigger = PrimitiveConfirmDialogTrigger;

export const ConfirmDialogPortal = PrimitiveConfirmDialogPortal;

export const ConfirmDialogOverlay = forwardRef<HTMLDivElement, PrimitiveConfirmDialogOverlayProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveConfirmDialogOverlay
        ref={ref}
        className={cn("bg-black/50 backdrop-blur-sm", className)}
        {...props}
      />
    );
  },
);

ConfirmDialogOverlay.displayName = "ConfirmDialogOverlay";

export type ConfirmDialogContentProps = PrimitiveConfirmDialogContentProps;

export const ConfirmDialogContent = forwardRef<HTMLDivElement, ConfirmDialogContentProps>(
  ({ className, overlayClassName, ...props }, ref) => {
    return (
      <PrimitiveConfirmDialogContent
        ref={ref}
        overlayClassName={cn("bg-black/50 backdrop-blur-sm", overlayClassName)}
        className={cn("rounded-xl shadow-xl", className)}
        {...props}
      />
    );
  },
);

ConfirmDialogContent.displayName = "ConfirmDialogContent";

export type ConfirmDialogHeaderProps = PrimitiveConfirmDialogHeaderProps;

export const ConfirmDialogHeader = forwardRef<HTMLDivElement, ConfirmDialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveConfirmDialogHeader ref={ref} className={cn("gap-2", className)} {...props} />;
  },
);

ConfirmDialogHeader.displayName = "ConfirmDialogHeader";

export type ConfirmDialogFooterProps = PrimitiveConfirmDialogFooterProps;

export const ConfirmDialogFooter = forwardRef<HTMLDivElement, ConfirmDialogFooterProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveConfirmDialogFooter ref={ref} className={cn("pt-1", className)} {...props} />;
  },
);

ConfirmDialogFooter.displayName = "ConfirmDialogFooter";

export type ConfirmDialogTitleProps = PrimitiveConfirmDialogTitleProps;

export const ConfirmDialogTitle = forwardRef<HTMLHeadingElement, ConfirmDialogTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveConfirmDialogTitle
        ref={ref}
        className={cn("text-foreground", className)}
        {...props}
      />
    );
  },
);

ConfirmDialogTitle.displayName = "ConfirmDialogTitle";

export type ConfirmDialogDescriptionProps = PrimitiveConfirmDialogDescriptionProps;

export const ConfirmDialogDescription = forwardRef<
  HTMLParagraphElement,
  ConfirmDialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveConfirmDialogDescription
      ref={ref}
      className={cn("leading-relaxed", className)}
      {...props}
    />
  );
});

ConfirmDialogDescription.displayName = "ConfirmDialogDescription";

export type ConfirmDialogCancelProps = PrimitiveConfirmDialogCancelProps;

export const ConfirmDialogCancel = forwardRef<HTMLButtonElement, ConfirmDialogCancelProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveConfirmDialogCancel
        ref={ref}
        className={cn(
          "bg-background md:hover:bg-muted shadow-sm",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          className,
        )}
        {...props}
      />
    );
  },
);

ConfirmDialogCancel.displayName = "ConfirmDialogCancel";

export type ConfirmDialogActionProps = PrimitiveConfirmDialogActionProps;

export const ConfirmDialogAction = forwardRef<HTMLButtonElement, ConfirmDialogActionProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveConfirmDialogAction
        ref={ref}
        className={cn("shadow-sm", "focus-visible:ring-0 focus-visible:ring-offset-0", className)}
        {...props}
      />
    );
  },
);

ConfirmDialogAction.displayName = "ConfirmDialogAction";

export default ConfirmDialog;

export type { ConfirmDialogPortalProps, ConfirmDialogProps, ConfirmDialogTriggerProps };
