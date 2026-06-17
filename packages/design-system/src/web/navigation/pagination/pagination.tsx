"use client";

import { forwardRef } from "react";

import {
  Pagination as PrimitivePagination,
  PaginationButton as PrimitivePaginationButton,
  PaginationEllipsis as PrimitivePaginationEllipsis,
  PaginationItem as PrimitivePaginationItem,
  PaginationLink as PrimitivePaginationLink,
  PaginationList as PrimitivePaginationList,
  type PaginationButtonProps,
  type PaginationEllipsisProps,
  type PaginationItemProps,
  type PaginationLinkProps,
  type PaginationListProps,
  type PaginationProps,
} from "../../../primitives/navigation/pagination";
import { cn } from "../../../utils";

const Pagination = forwardRef<HTMLElement, PaginationProps>(({ className, ...props }, ref) => {
  return (
    <PrimitivePagination ref={ref} className={cn("text-muted-foreground", className)} {...props} />
  );
});

Pagination.displayName = "Pagination";

export const PaginationList = forwardRef<HTMLUListElement, PaginationListProps>(
  ({ className, ...props }, ref) => {
    return <PrimitivePaginationList ref={ref} className={cn("gap-1", className)} {...props} />;
  },
);

PaginationList.displayName = "PaginationList";

export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => {
    return <PrimitivePaginationItem ref={ref} className={cn("min-w-0", className)} {...props} />;
  },
);

PaginationItem.displayName = "PaginationItem";

export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitivePaginationLink
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

PaginationLink.displayName = "PaginationLink";

export const PaginationButton = forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitivePaginationButton
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

PaginationButton.displayName = "PaginationButton";

export const PaginationEllipsis = forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitivePaginationEllipsis
        ref={ref}
        className={cn("text-muted-foreground", className)}
        {...props}
      />
    );
  },
);

PaginationEllipsis.displayName = "PaginationEllipsis";

export default Pagination;
