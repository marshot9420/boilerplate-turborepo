"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";

import { cn } from "../../../utils";

const dropdownMenuContentVariants = cva(
  [
    "border-border z-50 min-w-40 overflow-hidden rounded-md border",
    "bg-surface text-surface-foreground p-1 shadow-md",
    "outline-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
  ],
  {
    variants: {
      size: {
        sm: "min-w-36",
        md: "min-w-44",
        lg: "min-w-56",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const dropdownMenuItemVariants = cva(
  [
    "relative flex cursor-default items-center gap-2 rounded-sm select-none",
    "px-2 py-1.5 text-sm transition-colors outline-none",
    "focus:bg-muted",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "text-foreground",
        destructive: "text-destructive focus:bg-destructive focus:text-destructive-foreground",
      },
      inset: {
        true: "pl-8",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const dropdownMenuLabelVariants = cva("px-2 py-1.5 text-sm font-medium", {
  variants: {
    inset: {
      true: "pl-8",
    },
  },
});

const dropdownMenuSeparatorVariants = cva("bg-border -mx-1 my-1 h-px");

export const DropdownMenu = DropdownMenuPrimitive.Root;

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuGroup = DropdownMenuPrimitive.Group;

export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export type DropdownMenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
> &
  VariantProps<typeof dropdownMenuContentVariants>;

export const DropdownMenuContent = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, size, sideOffset = 4, ...props }, ref) => {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        data-size={size ?? "md"}
        className={cn(dropdownMenuContentVariants({ size }), className)}
        {...props}
      />
    </DropdownMenuPortal>
  );
});

DropdownMenuContent.displayName = "DropdownMenuContent";

export type DropdownMenuItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> &
  VariantProps<typeof dropdownMenuItemVariants>;

export const DropdownMenuItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, variant, inset, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      data-variant={variant ?? "default"}
      data-inset={inset ? "true" : "false"}
      className={cn(dropdownMenuItemVariants({ variant, inset }), className)}
      {...props}
    />
  );
});

DropdownMenuItem.displayName = "DropdownMenuItem";

export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.CheckboxItem
> &
  VariantProps<typeof dropdownMenuItemVariants>;

export const DropdownMenuCheckboxItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, variant, inset, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      data-variant={variant ?? "default"}
      data-inset={inset ? "true" : "false"}
      className={cn(dropdownMenuItemVariants({ variant, inset }), className)}
      {...props}
    />
  );
});

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

export type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioItem
> &
  VariantProps<typeof dropdownMenuItemVariants>;

export const DropdownMenuRadioItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, variant, inset, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      data-variant={variant ?? "default"}
      data-inset={inset ? "true" : "false"}
      className={cn(dropdownMenuItemVariants({ variant, inset }), className)}
      {...props}
    />
  );
});

DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

export type DropdownMenuLabelProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> &
  VariantProps<typeof dropdownMenuLabelVariants>;

export const DropdownMenuLabel = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      data-inset={inset ? "true" : "false"}
      className={cn(dropdownMenuLabelVariants({ inset }), className)}
      {...props}
    />
  );
});

DropdownMenuLabel.displayName = "DropdownMenuLabel";

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>;

export const DropdownMenuSeparator = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn(dropdownMenuSeparatorVariants(), className)}
      {...props}
    />
  );
});

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
