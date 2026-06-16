"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

export type DataListSize = "sm" | "md" | "lg";
export type DataListOrientation = "vertical" | "horizontal" | "responsive";

export interface DataListProps extends HTMLAttributes<HTMLDListElement> {
  size?: DataListSize;
  divided?: boolean;
}

const DataList = forwardRef<HTMLDListElement, DataListProps>(
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

DataList.displayName = "DataList";

export interface DataListItemProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DataListOrientation;
}

export const DataListItem = forwardRef<HTMLDivElement, DataListItemProps>(
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

DataListItem.displayName = "DataListItem";

export type DataListLabelProps = HTMLAttributes<HTMLElement>;

export const DataListLabel = forwardRef<HTMLElement, DataListLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <dt ref={ref} className={cn("text-muted-foreground font-medium", className)} {...props} />
    );
  },
);

DataListLabel.displayName = "DataListLabel";

export interface DataListValueProps extends HTMLAttributes<HTMLElement> {
  placeholder?: ReactNode;
}

export const DataListValue = forwardRef<HTMLElement, DataListValueProps>(
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

DataListValue.displayName = "DataListValue";

export default DataList;
