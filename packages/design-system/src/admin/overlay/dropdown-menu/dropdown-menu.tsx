"use client";

import { forwardRef, type ComponentRef } from "react";

import {
  DropdownMenu as PrimitiveDropdownMenu,
  DropdownMenuCheckboxItem as PrimitiveDropdownMenuCheckboxItem,
  DropdownMenuContent as PrimitiveDropdownMenuContent,
  DropdownMenuGroup as PrimitiveDropdownMenuGroup,
  DropdownMenuItem as PrimitiveDropdownMenuItem,
  DropdownMenuLabel as PrimitiveDropdownMenuLabel,
  DropdownMenuPortal as PrimitiveDropdownMenuPortal,
  DropdownMenuRadioGroup as PrimitiveDropdownMenuRadioGroup,
  DropdownMenuRadioItem as PrimitiveDropdownMenuRadioItem,
  DropdownMenuSeparator as PrimitiveDropdownMenuSeparator,
  DropdownMenuSub as PrimitiveDropdownMenuSub,
  DropdownMenuTrigger as PrimitiveDropdownMenuTrigger,
  type DropdownMenuCheckboxItemProps,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
  type DropdownMenuLabelProps,
  type DropdownMenuRadioItemProps,
  type DropdownMenuSeparatorProps,
} from "../../../primitives/overlay/dropdown-menu";
import { cn } from "../../../utils";

const DropdownMenu = PrimitiveDropdownMenu;
const DropdownMenuTrigger = PrimitiveDropdownMenuTrigger;
const DropdownMenuGroup = PrimitiveDropdownMenuGroup;
const DropdownMenuPortal = PrimitiveDropdownMenuPortal;
const DropdownMenuSub = PrimitiveDropdownMenuSub;
const DropdownMenuRadioGroup = PrimitiveDropdownMenuRadioGroup;

export const DropdownMenuContent = forwardRef<
  ComponentRef<typeof PrimitiveDropdownMenuContent>,
  DropdownMenuContentProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveDropdownMenuContent
      ref={ref}
      className={cn("bg-surface/95 shadow-lg", className)}
      {...props}
    />
  );
});

DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = forwardRef<
  ComponentRef<typeof PrimitiveDropdownMenuItem>,
  DropdownMenuItemProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveDropdownMenuItem
      ref={ref}
      className={cn(
        "focus:bg-muted/80",
        "data-[variant=destructive]:focus:bg-destructive/90",
        className,
      )}
      {...props}
    />
  );
});

DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuCheckboxItem = forwardRef<
  ComponentRef<typeof PrimitiveDropdownMenuCheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveDropdownMenuCheckboxItem
      ref={ref}
      className={cn(
        "focus:bg-muted/80",
        "data-[variant=destructive]:focus:bg-destructive/90",
        className,
      )}
      {...props}
    />
  );
});

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

export const DropdownMenuRadioItem = forwardRef<
  ComponentRef<typeof PrimitiveDropdownMenuRadioItem>,
  DropdownMenuRadioItemProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveDropdownMenuRadioItem
      ref={ref}
      className={cn(
        "focus:bg-muted/80",
        "data-[variant=destructive]:focus:bg-destructive/90",
        className,
      )}
      {...props}
    />
  );
});

DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

export const DropdownMenuLabel = forwardRef<
  ComponentRef<typeof PrimitiveDropdownMenuLabel>,
  DropdownMenuLabelProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveDropdownMenuLabel ref={ref} className={cn("text-foreground", className)} {...props} />
  );
});

DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenuSeparator = forwardRef<
  ComponentRef<typeof PrimitiveDropdownMenuSeparator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <PrimitiveDropdownMenuSeparator
      ref={ref}
      className={cn("bg-border/80", className)}
      {...props}
    />
  );
});

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export default DropdownMenu;
export {
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSub,
  DropdownMenuTrigger,
};
export type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
};
