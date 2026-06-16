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

export const SidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ className, sidebarWidth = "md", style, ...props }, ref) => {
    const mergedStyle = {
      "--ds-sidebar-width": SIDEBAR_WIDTH_VALUE[sidebarWidth],
      ...style,
    } satisfies CSSProperties & Record<"--ds-sidebar-width", string>;

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen w-full bg-background text-foreground lg:grid",
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

SidebarLayout.displayName = "SidebarLayout";

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  variant?: SidebarVariant;
  sticky?: boolean;
  hiddenOnMobile?: boolean;
}

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      className,
      variant = "default",
      sticky = true,
      hiddenOnMobile = true,
      ...props
    },
    ref,
  ) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "min-h-screen w-full border-r border-border bg-surface text-surface-foreground",
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

Sidebar.displayName = "Sidebar";

export type SidebarInsetProps = ComponentPropsWithoutRef<"main">;

export const SidebarInset = forwardRef<HTMLElement, SidebarInsetProps>(
  ({ className, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn("min-w-0 flex-1 bg-background", className)}
        {...props}
      />
    );
  },
);

SidebarInset.displayName = "SidebarInset";

export type SidebarHeaderProps = HTMLAttributes<HTMLDivElement>;

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-16 items-center gap-3 border-b border-border px-4",
          className,
        )}
        {...props}
      />
    );
  },
);

SidebarHeader.displayName = "SidebarHeader";

export type SidebarContentProps = HTMLAttributes<HTMLDivElement>;

export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-y-auto p-3", className)}
        {...props}
      />
    );
  },
);

SidebarContent.displayName = "SidebarContent";

export type SidebarFooterProps = HTMLAttributes<HTMLDivElement>;

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-t border-border p-3", className)}
        {...props}
      />
    );
  },
);

SidebarFooter.displayName = "SidebarFooter";

export type SidebarGroupProps = HTMLAttributes<HTMLDivElement>;

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("space-y-1", className)} {...props} />;
  },
);

SidebarGroup.displayName = "SidebarGroup";

export type SidebarGroupLabelProps = HTMLAttributes<HTMLDivElement>;

export const SidebarGroupLabel = forwardRef<
  HTMLDivElement,
  SidebarGroupLabelProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
});

SidebarGroupLabel.displayName = "SidebarGroupLabel";

export interface SidebarNavProps extends ComponentPropsWithoutRef<"nav"> {
  label?: string;
}

export const SidebarNav = forwardRef<HTMLElement, SidebarNavProps>(
  ({ className, label = "Sidebar navigation", ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn("space-y-4", className)}
        aria-label={label}
        {...props}
      />
    );
  },
);

SidebarNav.displayName = "SidebarNav";

export type SidebarNavListProps = HTMLAttributes<HTMLUListElement>;

export const SidebarNavList = forwardRef<HTMLUListElement, SidebarNavListProps>(
  ({ className, ...props }, ref) => {
    return <ul ref={ref} className={cn("space-y-1", className)} {...props} />;
  },
);

SidebarNavList.displayName = "SidebarNavList";

export type SidebarNavItemProps = LiHTMLAttributes<HTMLLIElement>;

export const SidebarNavItem = forwardRef<HTMLLIElement, SidebarNavItemProps>(
  ({ className, ...props }, ref) => {
    return <li ref={ref} className={cn("", className)} {...props} />;
  },
);

SidebarNavItem.displayName = "SidebarNavItem";

export interface SidebarNavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  tone?: SidebarNavLinkTone;
}

export const SidebarNavLink = forwardRef<
  HTMLAnchorElement,
  SidebarNavLinkProps
>(
  (
    {
      className,
      active = false,
      tone = "default",
      "aria-current": ariaCurrent,
      ...props
    },
    ref,
  ) => {
    return (
      <a
        ref={ref}
        className={cn(
          "flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          tone === "default" &&
            "text-muted-foreground hover:bg-muted hover:text-foreground",
          tone === "danger" &&
            "text-destructive hover:bg-destructive/10 hover:text-destructive",
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

SidebarNavLink.displayName = "SidebarNavLink";

export type SidebarSeparatorProps = HTMLAttributes<HTMLDivElement>;

export const SidebarSeparator = forwardRef<
  HTMLDivElement,
  SidebarSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("my-3 h-px bg-border", className)}
      role="separator"
      {...props}
    />
  );
});

SidebarSeparator.displayName = "SidebarSeparator";

export default Sidebar;
