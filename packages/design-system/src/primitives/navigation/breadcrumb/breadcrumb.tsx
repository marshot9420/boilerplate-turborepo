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

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, label = "Breadcrumb", ...props }, ref) => {
    return <nav ref={ref} className={cn("text-sm", className)} aria-label={label} {...props} />;
  },
);

Breadcrumb.displayName = "Breadcrumb";

export type BreadcrumbListProps = HTMLAttributes<HTMLOListElement>;

export const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
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

BreadcrumbList.displayName = "BreadcrumbList";

export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>;

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
    );
  },
);

BreadcrumbItem.displayName = "BreadcrumbItem";

export type BreadcrumbLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
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

BreadcrumbLink.displayName = "BreadcrumbLink";

export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;

export const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
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

BreadcrumbPage.displayName = "BreadcrumbPage";

export interface BreadcrumbSeparatorProps extends LiHTMLAttributes<HTMLLIElement> {
  children?: ReactNode;
}

export const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
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

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export type BreadcrumbEllipsisProps = HTMLAttributes<HTMLSpanElement>;

export const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
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

BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export default Breadcrumb;
