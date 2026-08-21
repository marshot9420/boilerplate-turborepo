"use client";

import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type HTMLAttributes,
  type LiHTMLAttributes,
} from "react";

import { cn } from "../../../utils";

export type SidebarWidth = "sm" | "md" | "lg";

export type SidebarVariant = "default" | "floating";

export type SidebarNavLinkTone = "default" | "danger";

const SIDEBAR_WIDTH_VALUE: Record<SidebarWidth, string> = {
  sm: "14rem",
  md: "16rem",
  lg: "18rem",
};

export interface SidebarLayoutProps extends HTMLAttributes<HTMLDivElement> {
  sidebarWidth?: SidebarWidth;
}

const BaseSidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ className, sidebarWidth = "md", style, ...props }, ref) => {
    const mergedStyle = {
      "--ds-sidebar-width": SIDEBAR_WIDTH_VALUE[sidebarWidth],
      ...style,
    } satisfies CSSProperties & Record<"--ds-sidebar-width", string>;
    return (
      <div
        ref={ref}
        className={cn(
          "bg-background text-foreground min-h-screen w-full lg:grid",
          "lg:grid-cols-[var(--ds-sidebar-width)_minmax(0,1fr)]",
          className,
        )}
        style={mergedStyle}
        data-sidebar-width={sidebarWidth}
        {...props}
      />
    );
  },
);

BaseSidebarLayout.displayName = "SidebarLayout";

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  variant?: SidebarVariant;
  sticky?: boolean;
  hiddenOnMobile?: boolean;
}

const BaseSidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ className, variant = "default", sticky = true, hiddenOnMobile = true, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "border-border bg-surface text-surface-foreground min-h-screen w-full border-r",
          "flex-col",
          hiddenOnMobile ? "hidden lg:flex" : "flex",
          sticky && "lg:sticky lg:top-0 lg:h-screen",
          variant === "floating" && "rounded-lg border shadow-sm",
          className,
        )}
        data-variant={variant}
        data-sticky={sticky ? "true" : "false"}
        data-hidden-on-mobile={hiddenOnMobile ? "true" : "false"}
        {...props}
      />
    );
  },
);

BaseSidebar.displayName = "Sidebar";

export type SidebarInsetProps = ComponentPropsWithoutRef<"main">;

const BaseSidebarInset = forwardRef<HTMLElement, SidebarInsetProps>(
  ({ className, ...props }, ref) => {
    return <main ref={ref} className={cn("bg-background min-w-0 flex-1", className)} {...props} />;
  },
);

BaseSidebarInset.displayName = "SidebarInset";

export type SidebarHeaderProps = HTMLAttributes<HTMLDivElement>;

const BaseSidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-border flex min-h-16 items-center gap-3 border-b px-4", className)}
        {...props}
      />
    );
  },
);

BaseSidebarHeader.displayName = "SidebarHeader";

export type SidebarContentProps = HTMLAttributes<HTMLDivElement>;

const BaseSidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex-1 overflow-y-auto p-3", className)} {...props} />;
  },
);

BaseSidebarContent.displayName = "SidebarContent";

export type SidebarFooterProps = HTMLAttributes<HTMLDivElement>;

const BaseSidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("border-border border-t p-3", className)} {...props} />;
  },
);

BaseSidebarFooter.displayName = "SidebarFooter";

export type SidebarGroupProps = HTMLAttributes<HTMLDivElement>;

const BaseSidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("space-y-1", className)} {...props} />;
  },
);

BaseSidebarGroup.displayName = "SidebarGroup";

export type SidebarGroupLabelProps = HTMLAttributes<HTMLDivElement>;

const BaseSidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-muted-foreground px-2 py-1.5 text-xs font-medium", className)}
        {...props}
      />
    );
  },
);

BaseSidebarGroupLabel.displayName = "SidebarGroupLabel";

export interface SidebarNavProps extends ComponentPropsWithoutRef<"nav"> {
  label?: string;
}

const BaseSidebarNav = forwardRef<HTMLElement, SidebarNavProps>(
  ({ className, label = "Sidebar navigation", ...props }, ref) => {
    return <nav ref={ref} className={cn("space-y-4", className)} aria-label={label} {...props} />;
  },
);

BaseSidebarNav.displayName = "SidebarNav";

export type SidebarNavListProps = HTMLAttributes<HTMLUListElement>;

const BaseSidebarNavList = forwardRef<HTMLUListElement, SidebarNavListProps>(
  ({ className, ...props }, ref) => {
    return <ul ref={ref} className={cn("space-y-1", className)} {...props} />;
  },
);

BaseSidebarNavList.displayName = "SidebarNavList";

export type SidebarNavItemProps = LiHTMLAttributes<HTMLLIElement>;

const BaseSidebarNavItem = forwardRef<HTMLLIElement, SidebarNavItemProps>(
  ({ className, ...props }, ref) => {
    return <li ref={ref} className={cn("", className)} {...props} />;
  },
);

BaseSidebarNavItem.displayName = "SidebarNavItem";

export interface SidebarNavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  tone?: SidebarNavLinkTone;
}

const BaseSidebarNavLink = forwardRef<HTMLAnchorElement, SidebarNavLinkProps>(
  ({ className, active = false, tone = "default", "aria-current": ariaCurrent, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          tone === "default" && "text-muted-foreground hover:bg-muted hover:text-foreground",
          tone === "danger" && "text-destructive hover:bg-destructive/10 hover:text-destructive",
          active && tone === "default" && "bg-muted text-foreground",
          active && tone === "danger" && "bg-destructive/10 text-destructive",
          className,
        )}
        aria-current={ariaCurrent ?? (active ? "page" : undefined)}
        data-active={active ? "true" : "false"}
        data-tone={tone}
        {...props}
      />
    );
  },
);

BaseSidebarNavLink.displayName = "SidebarNavLink";

export type SidebarSeparatorProps = HTMLAttributes<HTMLDivElement>;

const BaseSidebarSeparator = forwardRef<HTMLDivElement, SidebarSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("bg-border my-3 h-px", className)} role="separator" {...props} />
    );
  },
);

BaseSidebarSeparator.displayName = "SidebarSeparator";

export const SidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ className, ...props }, ref) => {
    return <BaseSidebarLayout ref={ref} className={cn("bg-background", className)} {...props} />;
  },
);

SidebarLayout.displayName = "SidebarLayout";

const Sidebar = forwardRef<HTMLElement, SidebarProps>(({ className, ...props }, ref) => {
  return <BaseSidebar ref={ref} className={cn("bg-surface", className)} {...props} />;
});

Sidebar.displayName = "Sidebar";

export const SidebarInset = forwardRef<HTMLElement, SidebarInsetProps>(
  ({ className, ...props }, ref) => {
    return <BaseSidebarInset ref={ref} className={cn("min-h-screen", className)} {...props} />;
  },
);

SidebarInset.displayName = "SidebarInset";

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    return <BaseSidebarHeader ref={ref} className={cn("bg-surface", className)} {...props} />;
  },
);

SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    return <BaseSidebarContent ref={ref} className={cn("scroll-py-3", className)} {...props} />;
  },
);

SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => {
    return <BaseSidebarFooter ref={ref} className={cn("bg-surface", className)} {...props} />;
  },
);

SidebarFooter.displayName = "SidebarFooter";

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, ...props }, ref) => {
    return <BaseSidebarGroup ref={ref} className={cn("space-y-1.5", className)} {...props} />;
  },
);

SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseSidebarGroupLabel ref={ref} className={cn("tracking-wide", className)} {...props} />
    );
  },
);

SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarNav = forwardRef<HTMLElement, SidebarNavProps>(
  ({ className, ...props }, ref) => {
    return <BaseSidebarNav ref={ref} className={cn("space-y-5", className)} {...props} />;
  },
);

SidebarNav.displayName = "SidebarNav";

export const SidebarNavList = forwardRef<HTMLUListElement, SidebarNavListProps>(
  ({ className, ...props }, ref) => {
    return <BaseSidebarNavList ref={ref} className={cn("space-y-1", className)} {...props} />;
  },
);

SidebarNavList.displayName = "SidebarNavList";

export const SidebarNavItem = forwardRef<HTMLLIElement, SidebarNavItemProps>(
  ({ className, ...props }, ref) => {
    return <BaseSidebarNavItem ref={ref} className={cn("min-w-0", className)} {...props} />;
  },
);

SidebarNavItem.displayName = "SidebarNavItem";

export const SidebarNavLink = forwardRef<HTMLAnchorElement, SidebarNavLinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseSidebarNavLink
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
    return <BaseSidebarSeparator ref={ref} className={cn("my-4", className)} {...props} />;
  },
);

SidebarSeparator.displayName = "SidebarSeparator";

export default Sidebar;
