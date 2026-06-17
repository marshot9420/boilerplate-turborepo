"use client";

import { forwardRef } from "react";

import {
  Sidebar as PrimitiveSidebar,
  SidebarContent as PrimitiveSidebarContent,
  SidebarFooter as PrimitiveSidebarFooter,
  SidebarGroup as PrimitiveSidebarGroup,
  SidebarGroupLabel as PrimitiveSidebarGroupLabel,
  SidebarHeader as PrimitiveSidebarHeader,
  SidebarInset as PrimitiveSidebarInset,
  SidebarLayout as PrimitiveSidebarLayout,
  SidebarNav as PrimitiveSidebarNav,
  SidebarNavItem as PrimitiveSidebarNavItem,
  SidebarNavLink as PrimitiveSidebarNavLink,
  SidebarNavList as PrimitiveSidebarNavList,
  SidebarSeparator as PrimitiveSidebarSeparator,
  type SidebarContentProps,
  type SidebarFooterProps,
  type SidebarGroupLabelProps,
  type SidebarGroupProps,
  type SidebarHeaderProps,
  type SidebarInsetProps,
  type SidebarLayoutProps,
  type SidebarNavItemProps,
  type SidebarNavLinkProps,
  type SidebarNavListProps,
  type SidebarNavProps,
  type SidebarProps,
  type SidebarSeparatorProps,
} from "../../../primitives/layout/sidebar";
import { cn } from "../../../utils";

export const SidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveSidebarLayout ref={ref} className={cn("bg-background", className)} {...props} />
    );
  },
);

SidebarLayout.displayName = "SidebarLayout";

const Sidebar = forwardRef<HTMLElement, SidebarProps>(({ className, ...props }, ref) => {
  return <PrimitiveSidebar ref={ref} className={cn("bg-surface/95", className)} {...props} />;
});

Sidebar.displayName = "Sidebar";

export const SidebarInset = forwardRef<HTMLElement, SidebarInsetProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveSidebarInset ref={ref} className={cn("min-h-screen", className)} {...props} />;
  },
);

SidebarInset.displayName = "SidebarInset";

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveSidebarHeader ref={ref} className={cn("bg-surface/80", className)} {...props} />
    );
  },
);

SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveSidebarContent ref={ref} className={cn("scroll-py-3", className)} {...props} />
    );
  },
);

SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveSidebarFooter ref={ref} className={cn("bg-surface/80", className)} {...props} />
    );
  },
);

SidebarFooter.displayName = "SidebarFooter";

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveSidebarGroup ref={ref} className={cn("space-y-1.5", className)} {...props} />;
  },
);

SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveSidebarGroupLabel
        ref={ref}
        className={cn("tracking-wide uppercase", className)}
        {...props}
      />
    );
  },
);

SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarNav = forwardRef<HTMLElement, SidebarNavProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveSidebarNav ref={ref} className={cn("space-y-5", className)} {...props} />;
  },
);

SidebarNav.displayName = "SidebarNav";

export const SidebarNavList = forwardRef<HTMLUListElement, SidebarNavListProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveSidebarNavList ref={ref} className={cn("space-y-1", className)} {...props} />;
  },
);

SidebarNavList.displayName = "SidebarNavList";

export const SidebarNavItem = forwardRef<HTMLLIElement, SidebarNavItemProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveSidebarNavItem ref={ref} className={cn("min-w-0", className)} {...props} />;
  },
);

SidebarNavItem.displayName = "SidebarNavItem";

export const SidebarNavLink = forwardRef<HTMLAnchorElement, SidebarNavLinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveSidebarNavLink
        ref={ref}
        className={cn(
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "focus-visible:outline-ring focus-visible:outline-2",
          "data-[active=true]:font-semibold",
          className,
        )}
        {...props}
      />
    );
  },
);

SidebarNavLink.displayName = "SidebarNavLink";

export const SidebarSeparator = forwardRef<HTMLDivElement, SidebarSeparatorProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveSidebarSeparator ref={ref} className={cn("my-4", className)} {...props} />;
  },
);

SidebarSeparator.displayName = "SidebarSeparator";

export default Sidebar;
