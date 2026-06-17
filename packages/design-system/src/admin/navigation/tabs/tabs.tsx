"use client";

import {
  Tabs as PrimitiveTabs,
  TabsContent as PrimitiveTabsContent,
  TabsList as PrimitiveTabsList,
  TabsTrigger as PrimitiveTabsTrigger,
  type TabsContentProps,
  type TabsListProps,
  type TabsProps,
  type TabsTriggerProps,
} from "../../../primitives/navigation/tabs";
import { cn } from "../../../utils";

const Tabs = PrimitiveTabs;

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <PrimitiveTabsList
      className={cn("bg-muted/80", "border-border border", className)}
      {...props}
    />
  );
}

TabsList.displayName = "TabsList";

export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <PrimitiveTabsTrigger
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
    <PrimitiveTabsContent
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
export type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps };
