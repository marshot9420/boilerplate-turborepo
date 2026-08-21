"use client";

import { cva } from "class-variance-authority";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

export type DataListSize = "sm" | "md" | "lg";

export type DataListOrientation = "vertical" | "horizontal" | "responsive";

export interface BaseDataListProps extends HTMLAttributes<HTMLDListElement> {
  size?: DataListSize;
  divided?: boolean;
}

const BaseDataList = forwardRef<HTMLDListElement, BaseDataListProps>(
  ({ className, size = "md", divided = false, ...props }, ref) => {
    return (
      <dl
        ref={ref}
        className={cn(
          "grid",
          size === "sm" && "gap-2 text-xs",
          size === "md" && "gap-3 text-sm",
          size === "lg" && "gap-4 text-base",
          divided && "divide-border divide-y",
          className,
        )}
        data-size={size}
        data-divided={divided ? "true" : "false"}
        {...props}
      />
    );
  },
);

BaseDataList.displayName = "DataList";

export interface BaseDataListItemProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DataListOrientation;
}

const BaseDataListItem = forwardRef<HTMLDivElement, BaseDataListItemProps>(
  ({ className, orientation = "responsive", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-1",
          orientation === "vertical" && "grid-cols-1",
          orientation === "horizontal" && "grid-cols-[minmax(8rem,14rem)_1fr] items-start gap-4",
          orientation === "responsive" &&
            "grid-cols-1 sm:grid-cols-[minmax(8rem,14rem)_1fr] sm:items-start sm:gap-4",
          className,
        )}
        data-orientation={orientation}
        {...props}
      />
    );
  },
);

BaseDataListItem.displayName = "DataListItem";

export type BaseDataListLabelProps = HTMLAttributes<HTMLElement>;

const BaseDataListLabel = forwardRef<HTMLElement, BaseDataListLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <dt ref={ref} className={cn("text-muted-foreground font-medium", className)} {...props} />
    );
  },
);

BaseDataListLabel.displayName = "DataListLabel";

export interface BaseDataListValueProps extends HTMLAttributes<HTMLElement> {
  placeholder?: ReactNode;
}

const BaseDataListValue = forwardRef<HTMLElement, BaseDataListValueProps>(
  ({ className, children, placeholder = "—", ...props }, ref) => {
    const hasValue = children !== null && children !== undefined && children !== "";
    return (
      <dd
        ref={ref}
        className={cn("text-foreground", className)}
        data-empty={hasValue ? "false" : "true"}
        {...props}
      >
        {hasValue ? children : placeholder}
      </dd>
    );
  },
);

BaseDataListValue.displayName = "DataListValue";

const dataListClasses = cva(["border-border bg-surface rounded-lg border shadow-none"], {
  variants: {
    size: {
      sm: "p-3",
      md: "p-4",
      lg: "p-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const dataListItemClasses = cva(["py-2 first:pt-0 last:pb-0"]);

const dataListLabelClasses = cva(["text-xs font-semibold tracking-wide uppercase"]);

const dataListValueClasses = cva(["font-medium", "data-[empty=true]:text-muted-foreground"]);

export type DataListProps = BaseDataListProps;

export type DataListItemProps = BaseDataListItemProps;

export type DataListLabelProps = BaseDataListLabelProps;

export type DataListValueProps = BaseDataListValueProps;

const DataList = forwardRef<HTMLDListElement, DataListProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <BaseDataList
        ref={ref}
        size={size}
        className={cn(dataListClasses({ size }), className)}
        data-ds-component="data-list"
        {...props}
      />
    );
  },
);

DataList.displayName = "DataList";

export const DataListItem = forwardRef<HTMLDivElement, DataListItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseDataListItem
        ref={ref}
        className={cn(dataListItemClasses(), className)}
        data-ds-component="data-list-item"
        {...props}
      />
    );
  },
);

DataListItem.displayName = "DataListItem";

export const DataListLabel = forwardRef<HTMLElement, DataListLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseDataListLabel
        ref={ref}
        className={cn(dataListLabelClasses(), className)}
        data-ds-component="data-list-label"
        {...props}
      />
    );
  },
);

DataListLabel.displayName = "DataListLabel";

export const DataListValue = forwardRef<HTMLElement, DataListValueProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseDataListValue
        ref={ref}
        className={cn(dataListValueClasses(), className)}
        data-ds-component="data-list-value"
        {...props}
      />
    );
  },
);

DataListValue.displayName = "DataListValue";

export default DataList;
