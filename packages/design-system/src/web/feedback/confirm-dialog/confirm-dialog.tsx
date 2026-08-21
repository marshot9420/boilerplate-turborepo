"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";

import { cn } from "../../../utils";

export type ConfirmDialogProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>;

const BaseConfirmDialog = AlertDialogPrimitive.Root;

export type ConfirmDialogTriggerProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Trigger
>;

const BaseConfirmDialogTrigger = AlertDialogPrimitive.Trigger;

export type ConfirmDialogPortalProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal>;

const BaseConfirmDialogPortal = AlertDialogPrimitive.Portal;

export type BaseConfirmDialogOverlayProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Overlay
>;

const BaseConfirmDialogOverlay = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Overlay>,
  BaseConfirmDialogOverlayProps
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

BaseConfirmDialogOverlay.displayName = "ConfirmDialogOverlay";

export interface BaseConfirmDialogContentProps extends ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Content
> {
  overlayClassName?: string;
}

const BaseConfirmDialogContent = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Content>,
  BaseConfirmDialogContentProps
>(({ className, overlayClassName, ...props }, ref) => {
  return (
    <BaseConfirmDialogPortal>
      <BaseConfirmDialogOverlay className={overlayClassName} />

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
    </BaseConfirmDialogPortal>
  );
});

BaseConfirmDialogContent.displayName = "ConfirmDialogContent";

export type BaseConfirmDialogHeaderProps = ComponentPropsWithoutRef<"div">;

const BaseConfirmDialogHeader = forwardRef<HTMLDivElement, BaseConfirmDialogHeaderProps>(
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

BaseConfirmDialogHeader.displayName = "ConfirmDialogHeader";

export type BaseConfirmDialogFooterProps = ComponentPropsWithoutRef<"div">;

const BaseConfirmDialogFooter = forwardRef<HTMLDivElement, BaseConfirmDialogFooterProps>(
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

BaseConfirmDialogFooter.displayName = "ConfirmDialogFooter";

export type BaseConfirmDialogTitleProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Title
>;

const BaseConfirmDialogTitle = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Title>,
  BaseConfirmDialogTitleProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
});

BaseConfirmDialogTitle.displayName = "ConfirmDialogTitle";

export type BaseConfirmDialogDescriptionProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Description
>;

const BaseConfirmDialogDescription = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Description>,
  BaseConfirmDialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
});

BaseConfirmDialogDescription.displayName = "ConfirmDialogDescription";

export type BaseConfirmDialogCancelProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Cancel
>;

const BaseConfirmDialogCancel = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Cancel>,
  BaseConfirmDialogCancelProps
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

BaseConfirmDialogCancel.displayName = "ConfirmDialogCancel";

export type ConfirmDialogActionTone = "default" | "danger";

export interface BaseConfirmDialogActionProps extends ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Action
> {
  tone?: ConfirmDialogActionTone;
  loading?: boolean;
  loadingText?: string;
}

const BaseConfirmDialogAction = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Action>,
  BaseConfirmDialogActionProps
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

BaseConfirmDialogAction.displayName = "ConfirmDialogAction";

const ConfirmDialog = BaseConfirmDialog;

export const ConfirmDialogTrigger = BaseConfirmDialogTrigger;

export const ConfirmDialogPortal = BaseConfirmDialogPortal;

export const ConfirmDialogOverlay = forwardRef<HTMLDivElement, BaseConfirmDialogOverlayProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseConfirmDialogOverlay
        ref={ref}
        className={cn("bg-black/50 backdrop-blur-sm", className)}
        {...props}
      />
    );
  },
);

ConfirmDialogOverlay.displayName = "ConfirmDialogOverlay";

export type ConfirmDialogContentProps = BaseConfirmDialogContentProps;

export const ConfirmDialogContent = forwardRef<HTMLDivElement, ConfirmDialogContentProps>(
  ({ className, overlayClassName, ...props }, ref) => {
    return (
      <BaseConfirmDialogContent
        ref={ref}
        overlayClassName={cn("bg-black/50 backdrop-blur-sm", overlayClassName)}
        className={cn("rounded-xl shadow-xl", className)}
        {...props}
      />
    );
  },
);

ConfirmDialogContent.displayName = "ConfirmDialogContent";

export type ConfirmDialogHeaderProps = BaseConfirmDialogHeaderProps;

export const ConfirmDialogHeader = forwardRef<HTMLDivElement, ConfirmDialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return <BaseConfirmDialogHeader ref={ref} className={cn("gap-2", className)} {...props} />;
  },
);

ConfirmDialogHeader.displayName = "ConfirmDialogHeader";

export type ConfirmDialogFooterProps = BaseConfirmDialogFooterProps;

export const ConfirmDialogFooter = forwardRef<HTMLDivElement, ConfirmDialogFooterProps>(
  ({ className, ...props }, ref) => {
    return <BaseConfirmDialogFooter ref={ref} className={cn("pt-1", className)} {...props} />;
  },
);

ConfirmDialogFooter.displayName = "ConfirmDialogFooter";

export type ConfirmDialogTitleProps = BaseConfirmDialogTitleProps;

export const ConfirmDialogTitle = forwardRef<HTMLHeadingElement, ConfirmDialogTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseConfirmDialogTitle ref={ref} className={cn("text-foreground", className)} {...props} />
    );
  },
);

ConfirmDialogTitle.displayName = "ConfirmDialogTitle";

export type ConfirmDialogDescriptionProps = BaseConfirmDialogDescriptionProps;

export const ConfirmDialogDescription = forwardRef<
  HTMLParagraphElement,
  ConfirmDialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <BaseConfirmDialogDescription
      ref={ref}
      className={cn("leading-relaxed", className)}
      {...props}
    />
  );
});

ConfirmDialogDescription.displayName = "ConfirmDialogDescription";

export type ConfirmDialogCancelProps = BaseConfirmDialogCancelProps;

export const ConfirmDialogCancel = forwardRef<HTMLButtonElement, ConfirmDialogCancelProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseConfirmDialogCancel
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

export type ConfirmDialogActionProps = BaseConfirmDialogActionProps;

export const ConfirmDialogAction = forwardRef<HTMLButtonElement, ConfirmDialogActionProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseConfirmDialogAction
        ref={ref}
        className={cn("shadow-sm", "focus-visible:ring-0 focus-visible:ring-offset-0", className)}
        {...props}
      />
    );
  },
);

ConfirmDialogAction.displayName = "ConfirmDialogAction";

export default ConfirmDialog;
