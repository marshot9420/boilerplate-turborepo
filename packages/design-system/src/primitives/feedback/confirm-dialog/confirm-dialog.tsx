"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";

import { cn } from "../../../utils";

export type ConfirmDialogProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>;

const ConfirmDialog = AlertDialogPrimitive.Root;

export type ConfirmDialogTriggerProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Trigger
>;

export const ConfirmDialogTrigger = AlertDialogPrimitive.Trigger;

export type ConfirmDialogPortalProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal>;

export const ConfirmDialogPortal = AlertDialogPrimitive.Portal;

export type ConfirmDialogOverlayProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Overlay
>;

export const ConfirmDialogOverlay = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Overlay>,
  ConfirmDialogOverlayProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
});

ConfirmDialogOverlay.displayName = "ConfirmDialogOverlay";

export interface ConfirmDialogContentProps extends ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Content
> {
  overlayClassName?: string;
}

export const ConfirmDialogContent = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Content>,
  ConfirmDialogContentProps
>(({ className, overlayClassName, ...props }, ref) => {
  return (
    <ConfirmDialogPortal>
      <ConfirmDialogOverlay className={overlayClassName} />

      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          "pointer-events-auto fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4",
          "border-border bg-surface text-surface-foreground rounded-lg border p-6 shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      />
    </ConfirmDialogPortal>
  );
});

ConfirmDialogContent.displayName = "ConfirmDialogContent";

export type ConfirmDialogHeaderProps = ComponentPropsWithoutRef<"div">;

export const ConfirmDialogHeader = forwardRef<HTMLDivElement, ConfirmDialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
        {...props}
      />
    );
  },
);

ConfirmDialogHeader.displayName = "ConfirmDialogHeader";

export type ConfirmDialogFooterProps = ComponentPropsWithoutRef<"div">;

export const ConfirmDialogFooter = forwardRef<HTMLDivElement, ConfirmDialogFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
        {...props}
      />
    );
  },
);

ConfirmDialogFooter.displayName = "ConfirmDialogFooter";

export type ConfirmDialogTitleProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>;

export const ConfirmDialogTitle = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Title>,
  ConfirmDialogTitleProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
});

ConfirmDialogTitle.displayName = "ConfirmDialogTitle";

export type ConfirmDialogDescriptionProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Description
>;

export const ConfirmDialogDescription = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Description>,
  ConfirmDialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
});

ConfirmDialogDescription.displayName = "ConfirmDialogDescription";

export type ConfirmDialogCancelProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>;

export const ConfirmDialogCancel = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Cancel>,
  ConfirmDialogCancelProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(
        "border-border bg-surface inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium",
        "hover:bg-muted transition-colors",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});

ConfirmDialogCancel.displayName = "ConfirmDialogCancel";

export type ConfirmDialogActionTone = "default" | "danger";

export interface ConfirmDialogActionProps extends ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Action
> {
  tone?: ConfirmDialogActionTone;
  loading?: boolean;
  loadingText?: string;
}

export const ConfirmDialogAction = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Action>,
  ConfirmDialogActionProps
>(
  (
    {
      className,
      tone = "default",
      loading = false,
      loadingText = "처리 중...",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedDisabled = disabled || loading;

    return (
      <AlertDialogPrimitive.Action
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium",
          "transition-colors",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          tone === "default" && "bg-primary text-primary-foreground hover:opacity-90",
          tone === "danger" && "bg-destructive text-destructive-foreground hover:opacity-90",
          className,
        )}
        disabled={resolvedDisabled}
        data-tone={tone}
        data-loading={loading ? "true" : "false"}
        {...props}
      >
        {loading ? loadingText : children}
      </AlertDialogPrimitive.Action>
    );
  },
);

ConfirmDialogAction.displayName = "ConfirmDialogAction";

export default ConfirmDialog;
