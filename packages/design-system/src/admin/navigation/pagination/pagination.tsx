"use client";

import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import type { PaginationMeta } from "@repo/core/pagination";

import { cn } from "../../../utils";

export type PaginationItemValue = number | "ellipsis";

export interface GetPaginationItemsParams {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}

const FIRST_PAGE = 1;

const DEFAULT_SIBLING_COUNT = 1;

function createRange(start: number, end: number): number[] {
  const length = end - start + 1;
  if (length <= 0) {
    return [];
  }
  return Array.from({ length }, (_, index) => start + index);
}

export function getPaginationItems({
  currentPage,
  totalPages,
  siblingCount = DEFAULT_SIBLING_COUNT,
}: GetPaginationItemsParams): PaginationItemValue[] {
  if (totalPages <= 0) {
    return [];
  }
  const safeCurrentPage = Math.min(Math.max(currentPage, FIRST_PAGE), totalPages);
  const totalVisibleItems = siblingCount * 2 + 5;
  if (totalPages <= totalVisibleItems) {
    return createRange(FIRST_PAGE, totalPages);
  }
  const leftSibling = Math.max(safeCurrentPage - siblingCount, FIRST_PAGE);
  const rightSibling = Math.min(safeCurrentPage + siblingCount, totalPages);
  const shouldShowLeftEllipsis = leftSibling > FIRST_PAGE + 1;
  const shouldShowRightEllipsis = rightSibling < totalPages - 1;
  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItems = createRange(FIRST_PAGE, 3 + siblingCount * 2);
    return [...leftItems, "ellipsis", totalPages];
  }
  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItems = createRange(totalPages - (2 + siblingCount * 2), totalPages);
    return [FIRST_PAGE, "ellipsis", ...rightItems];
  }
  return [
    FIRST_PAGE,
    "ellipsis",
    ...createRange(leftSibling, rightSibling),
    "ellipsis",
    totalPages,
  ];
}

export interface PaginationProps extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
  meta: PaginationMeta;
  siblingCount?: number;
  disabled?: boolean;
  getHref?: (page: number) => string;
  onPageChange?: (page: number) => void;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
  renderPageLabel?: (page: number) => ReactNode;
}

const BasePagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      meta,
      siblingCount = DEFAULT_SIBLING_COUNT,
      disabled = false,
      getHref,
      onPageChange,
      previousLabel = "이전",
      nextLabel = "다음",
      renderPageLabel,
      ...props
    },
    ref,
  ) => {
    const items = getPaginationItems({
      currentPage: meta.page,
      totalPages: meta.totalPages,
      siblingCount,
    });
    const previousPage = Math.max(meta.page - 1, FIRST_PAGE);
    const nextPage = Math.min(meta.page + 1, meta.totalPages);
    const isPreviousDisabled = disabled || !meta.hasPreviousPage || meta.page <= FIRST_PAGE;
    const isNextDisabled = disabled || !meta.hasNextPage || meta.page >= meta.totalPages;
    return (
      <nav
        ref={ref}
        className={cn("mx-auto flex w-full justify-center", className)}
        aria-label="Pagination"
        data-disabled={disabled ? "true" : "false"}
        {...props}
      >
        <BasePaginationList>
          <BasePaginationItem>
            <PaginationControl
              page={previousPage}
              disabled={isPreviousDisabled}
              getHref={getHref}
              onPageChange={onPageChange}
              aria-label="이전 페이지로 이동"
            >
              {previousLabel}
            </PaginationControl>
          </BasePaginationItem>

          {items.map((item, index) => {
            if (item === "ellipsis") {
              return (
                <BasePaginationItem key={`ellipsis-${index}`}>
                  <BasePaginationEllipsis />
                </BasePaginationItem>
              );
            }
            const active = item === meta.page;
            return (
              <BasePaginationItem key={item}>
                <PaginationControl
                  page={item}
                  active={active}
                  disabled={disabled}
                  getHref={getHref}
                  onPageChange={onPageChange}
                  aria-label={`${item} 페이지로 이동`}
                >
                  {renderPageLabel ? renderPageLabel(item) : item}
                </PaginationControl>
              </BasePaginationItem>
            );
          })}

          <BasePaginationItem>
            <PaginationControl
              page={nextPage}
              disabled={isNextDisabled}
              getHref={getHref}
              onPageChange={onPageChange}
              aria-label="다음 페이지로 이동"
            >
              {nextLabel}
            </PaginationControl>
          </BasePaginationItem>
        </BasePaginationList>
      </nav>
    );
  },
);

BasePagination.displayName = "Pagination";

export type PaginationListProps = HTMLAttributes<HTMLUListElement>;

const BasePaginationList = forwardRef<HTMLUListElement, PaginationListProps>(
  ({ className, ...props }, ref) => {
    return (
      <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
    );
  },
);

BasePaginationList.displayName = "PaginationList";

export type PaginationItemProps = HTMLAttributes<HTMLLIElement>;

const BasePaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => {
    return <li ref={ref} className={cn("", className)} {...props} />;
  },
);

BasePaginationItem.displayName = "PaginationItem";

export interface PaginationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  disabled?: boolean;
}

const BasePaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, active = false, disabled = false, tabIndex, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-transparent px-3 text-sm transition-colors",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          active && "border-border bg-surface text-foreground",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled ? true : undefined}
        tabIndex={disabled ? -1 : tabIndex}
        data-active={active ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        {...props}
      />
    );
  },
);

BasePaginationLink.displayName = "PaginationLink";

export interface PaginationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const BasePaginationButton = forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ className, active = false, disabled, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-transparent px-3 text-sm transition-colors",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          active && "border-border bg-surface text-foreground",
          className,
        )}
        disabled={disabled}
        aria-current={active ? "page" : undefined}
        data-active={active ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        {...props}
      />
    );
  },
);

BasePaginationButton.displayName = "PaginationButton";

export type PaginationEllipsisProps = HTMLAttributes<HTMLSpanElement>;

const BasePaginationEllipsis = forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("inline-flex h-9 min-w-9 items-center justify-center", className)}
        aria-hidden="true"
        {...props}
      >
        …
      </span>
    );
  },
);

BasePaginationEllipsis.displayName = "PaginationEllipsis";

interface PaginationControlProps {
  page: number;
  active?: boolean;
  disabled?: boolean;
  getHref?: (page: number) => string;
  onPageChange?: (page: number) => void;
  children: ReactNode;
  "aria-label": string;
}

function PaginationControl({
  page,
  active = false,
  disabled = false,
  getHref,
  onPageChange,
  children,
  "aria-label": ariaLabel,
}: PaginationControlProps) {
  const handleClick = () => {
    if (disabled) {
      return;
    }
    onPageChange?.(page);
  };
  if (getHref) {
    return (
      <BasePaginationLink
        href={disabled ? undefined : getHref(page)}
        active={active}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {children}
      </BasePaginationLink>
    );
  }
  return (
    <BasePaginationButton
      active={active}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </BasePaginationButton>
  );
}

const Pagination = forwardRef<HTMLElement, PaginationProps>(({ className, ...props }, ref) => {
  return <BasePagination ref={ref} className={cn("text-muted-foreground", className)} {...props} />;
});

Pagination.displayName = "Pagination";

export const PaginationList = forwardRef<HTMLUListElement, PaginationListProps>(
  ({ className, ...props }, ref) => {
    return <BasePaginationList ref={ref} className={cn("gap-1", className)} {...props} />;
  },
);

PaginationList.displayName = "PaginationList";

export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => {
    return <BasePaginationItem ref={ref} className={cn("min-w-0", className)} {...props} />;
  },
);

PaginationItem.displayName = "PaginationItem";

export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <BasePaginationLink
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
      <BasePaginationButton
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
      <BasePaginationEllipsis
        ref={ref}
        className={cn("text-muted-foreground", className)}
        {...props}
      />
    );
  },
);

PaginationEllipsis.displayName = "PaginationEllipsis";

export default Pagination;
