"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";

import { cn } from "../../../utils";

export type TabsSize = "sm" | "md" | "lg";

export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

const BaseTabs = TabsPrimitive.Root;

export interface TabsListProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  size?: TabsSize;
  fullWidth?: boolean;
}

const BaseTabsList = forwardRef<ComponentRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, size = "md", fullWidth = false, ...props }, ref) => {
    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          "bg-muted text-muted-foreground inline-flex items-center rounded-md p-1",
          fullWidth && "w-full",
          className,
        )}
        data-size={size}
        data-full-width={fullWidth ? "true" : "false"}
        {...props}
      />
    );
  },
);

BaseTabsList.displayName = "TabsList";

export interface TabsTriggerProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  size?: TabsSize;
  fullWidth?: boolean;
}

const BaseTabsTrigger = forwardRef<ComponentRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, size = "md", fullWidth = false, disabled, children, ...props }, ref) => {
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-sm font-medium whitespace-nowrap transition-colors",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
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

BaseTabsTrigger.displayName = "TabsTrigger";

export type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

const BaseTabsContent = forwardRef<ComponentRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <TabsPrimitive.Content
        ref={ref}
        className={cn(
          "focus-visible:ring-ring mt-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          className,
        )}
        {...props}
      />
    );
  },
);

BaseTabsContent.displayName = "TabsContent";

const Tabs = BaseTabs;

export function TabsList({ className, ...props }: TabsListProps) {
  return <BaseTabsList className={cn("bg-muted", className)} {...props} />;
}

TabsList.displayName = "TabsList";

export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <BaseTabsTrigger
      className={cn(
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "focus-visible:outline-ring focus-visible:outline-2",
        "data-[state=active]:border-border",
        className,
      )}
      {...props}
    />
  );
}

TabsTrigger.displayName = "TabsTrigger";

export function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <BaseTabsContent
      className={cn(
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "focus-visible:outline-ring focus-visible:outline-2",
        className,
      )}
      {...props}
    />
  );
}

TabsContent.displayName = "TabsContent";

export default Tabs;
