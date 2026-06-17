"use client";

import { forwardRef } from "react";

import {
  Breadcrumb as PrimitiveBreadcrumb,
  BreadcrumbEllipsis as PrimitiveBreadcrumbEllipsis,
  BreadcrumbItem as PrimitiveBreadcrumbItem,
  BreadcrumbLink as PrimitiveBreadcrumbLink,
  BreadcrumbList as PrimitiveBreadcrumbList,
  BreadcrumbPage as PrimitiveBreadcrumbPage,
  BreadcrumbSeparator as PrimitiveBreadcrumbSeparator,
  type BreadcrumbEllipsisProps,
  type BreadcrumbItemProps,
  type BreadcrumbLinkProps,
  type BreadcrumbListProps,
  type BreadcrumbPageProps,
  type BreadcrumbProps,
  type BreadcrumbSeparatorProps,
} from "../../../primitives/navigation/breadcrumb";
import { cn } from "../../../utils";

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(({ className, ...props }, ref) => {
  return (
    <PrimitiveBreadcrumb ref={ref} className={cn("text-muted-foreground", className)} {...props} />
  );
});

Breadcrumb.displayName = "Breadcrumb";

export const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveBreadcrumbList ref={ref} className={cn("gap-1.5", className)} {...props} />;
  },
);

BreadcrumbList.displayName = "BreadcrumbList";

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveBreadcrumbItem ref={ref} className={cn("min-w-0", className)} {...props} />;
  },
);

BreadcrumbItem.displayName = "BreadcrumbItem";

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveBreadcrumbLink
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
    return <PrimitiveBreadcrumbPage ref={ref} className={cn("truncate", className)} {...props} />;
  },
);

BreadcrumbPage.displayName = "BreadcrumbPage";

export const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveBreadcrumbSeparator ref={ref} className={cn("px-0.5", className)} {...props} />
    );
  },
);

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ className, ...props }, ref) => {
    return <PrimitiveBreadcrumbEllipsis ref={ref} className={cn("size-6", className)} {...props} />;
  },
);

BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export default Breadcrumb;
