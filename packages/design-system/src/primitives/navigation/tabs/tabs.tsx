"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";

import { cn } from "../../../utils";

export type TabsSize = "sm" | "md" | "lg";

export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

const Tabs = TabsPrimitive.Root;

export interface TabsListProps extends ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
> {
  size?: TabsSize;
  fullWidth?: boolean;
}

export const TabsList = forwardRef<
  ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, size = "md", fullWidth = false, ...props }, ref) => {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-md bg-muted p-1 text-muted-foreground",
        fullWidth && "w-full",
        className,
      )}
      data-size={size}
      data-full-width={fullWidth ? "true" : "false"}
      {...props}
    />
  );
});

TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> {
  size?: TabsSize;
  fullWidth?: boolean;
}

export const TabsTrigger = forwardRef<
  ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(
  (
    { className, size = "md", fullWidth = false, disabled, children, ...props },
    ref,
  ) => {
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "data-[state=active]:bg-surface data-[state=active]:text-surface-foreground data-[state=active]:shadow-sm",
          fullWidth && "flex-1",
          size === "sm" && "h-8 px-2.5 text-xs",
          size === "md" && "h-9 px-3 text-sm",
          size === "lg" && "h-10 px-4 text-base",
          className,
        )}
        disabled={disabled}
        data-size={size}
        data-full-width={fullWidth ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        {...props}
      >
        {children}
      </TabsPrimitive.Trigger>
    );
  },
);

TabsTrigger.displayName = "TabsTrigger";

export type TabsContentProps = ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
>;

export const TabsContent = forwardRef<
  ComponentRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  );
});

TabsContent.displayName = "TabsContent";

export default Tabs;
