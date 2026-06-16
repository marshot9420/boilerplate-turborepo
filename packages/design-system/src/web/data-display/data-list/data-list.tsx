"use client";

import { cva } from "class-variance-authority";

import { forwardRef } from "react";

import {
  DataList as PrimitiveDataList,
  DataListItem as PrimitiveDataListItem,
  DataListLabel as PrimitiveDataListLabel,
  DataListValue as PrimitiveDataListValue,
  type DataListItemProps as PrimitiveDataListItemProps,
  type DataListLabelProps as PrimitiveDataListLabelProps,
  type DataListProps as PrimitiveDataListProps,
  type DataListValueProps as PrimitiveDataListValueProps,
} from "../../../primitives/data-display/data-list";
import { cn } from "../../../utils";

const dataListClasses = cva(["border-border bg-surface rounded-2xl border shadow-sm"], {
  variants: {
    size: {
      sm: "p-4",
      md: "p-5",
      lg: "p-6",
    },
  },

  defaultVariants: {
    size: "md",
  },
});

const dataListItemClasses = cva(["py-2 first:pt-0 last:pb-0"]);

const dataListLabelClasses = cva(["text-sm leading-6"]);

const dataListValueClasses = cva([
  "leading-6 font-medium",
  "data-[empty=true]:text-muted-foreground",
]);

export type DataListProps = PrimitiveDataListProps;
export type DataListItemProps = PrimitiveDataListItemProps;
export type DataListLabelProps = PrimitiveDataListLabelProps;
export type DataListValueProps = PrimitiveDataListValueProps;

const DataList = forwardRef<HTMLDListElement, DataListProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <PrimitiveDataList
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
      <PrimitiveDataListItem
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
      <PrimitiveDataListLabel
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
      <PrimitiveDataListValue
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
