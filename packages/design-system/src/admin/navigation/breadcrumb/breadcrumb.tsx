"use client";

import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../../../utils";

export interface BreadcrumbProps extends ComponentPropsWithoutRef<"nav"> {
  label?: string;
}

const BaseBreadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, label = "Breadcrumb", ...props }, ref) => {
    return <nav ref={ref} className={cn("text-sm", className)} aria-label={label} {...props} />;
  },
);

BaseBreadcrumb.displayName = "Breadcrumb";

export type BreadcrumbListProps = HTMLAttributes<HTMLOListElement>;

const BaseBreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        className={cn(
          "text-muted-foreground flex flex-wrap items-center gap-1.5 wrap-break-word",
          className,
        )}
        {...props}
      />
    );
  },
);

BaseBreadcrumbList.displayName = "BreadcrumbList";

export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>;

const BaseBreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
    );
  },
);

BaseBreadcrumbItem.displayName = "BreadcrumbItem";

export type BreadcrumbLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const BaseBreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "hover:text-foreground transition-colors",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          className,
        )}
        {...props}
      />
    );
  },
);

BaseBreadcrumbLink.displayName = "BreadcrumbLink";

export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;

const BaseBreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("text-foreground font-medium", className)}
        aria-current="page"
        {...props}
      />
    );
  },
);

BaseBreadcrumbPage.displayName = "BreadcrumbPage";

export interface BreadcrumbSeparatorProps extends LiHTMLAttributes<HTMLLIElement> {
  children?: ReactNode;
}

const BaseBreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ className, children = "/", ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("text-muted-foreground select-none", className)}
        role="presentation"
        aria-hidden="true"
        {...props}
      >
        {children}
      </li>
    );
  },
);

BaseBreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export type BreadcrumbEllipsisProps = HTMLAttributes<HTMLSpanElement>;

const BaseBreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("inline-flex size-9 items-center justify-center", className)}
        aria-hidden="true"
        {...props}
      >
        …
      </span>
    );
  },
);

BaseBreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(({ className, ...props }, ref) => {
  return <BaseBreadcrumb ref={ref} className={cn("text-muted-foreground", className)} {...props} />;
});

Breadcrumb.displayName = "Breadcrumb";

export const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => {
    return <BaseBreadcrumbList ref={ref} className={cn("gap-1.5", className)} {...props} />;
  },
);

BreadcrumbList.displayName = "BreadcrumbList";

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => {
    return <BaseBreadcrumbItem ref={ref} className={cn("min-w-0", className)} {...props} />;
  },
);

BreadcrumbItem.displayName = "BreadcrumbItem";

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseBreadcrumbLink
        ref={ref}
        className={cn(
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "focus-visible:outline-ring focus-visible:outline-2",
          className,
        )}
        {...props}
      />
    );
  },
);

BreadcrumbLink.displayName = "BreadcrumbLink";

export const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => {
    return <BaseBreadcrumbPage ref={ref} className={cn("truncate", className)} {...props} />;
  },
);

BreadcrumbPage.displayName = "BreadcrumbPage";

export const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ className, ...props }, ref) => {
    return <BaseBreadcrumbSeparator ref={ref} className={cn("px-0.5", className)} {...props} />;
  },
);

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ className, ...props }, ref) => {
    return <BaseBreadcrumbEllipsis ref={ref} className={cn("size-6", className)} {...props} />;
  },
);

BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export default Breadcrumb;
