"use client";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;

export type GridGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export type GridAlign = "start" | "center" | "end" | "stretch";

export type GridJustify = "start" | "center" | "end" | "stretch";

export interface BaseGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: GridColumns;
  smColumns?: GridColumns;
  mdColumns?: GridColumns;
  lgColumns?: GridColumns;
  gap?: GridGap;
  align?: GridAlign;
  justify?: GridJustify;
}

function getColumnsClass(columns: GridColumns): string {
  const columnsClassMap: Record<GridColumns, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    12: "grid-cols-12",
  };
  return columnsClassMap[columns];
}

function getSmColumnsClass(columns: GridColumns): string {
  const columnsClassMap: Record<GridColumns, string> = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
    12: "sm:grid-cols-12",
  };
  return columnsClassMap[columns];
}

function getMdColumnsClass(columns: GridColumns): string {
  const columnsClassMap: Record<GridColumns, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
    12: "md:grid-cols-12",
  };
  return columnsClassMap[columns];
}

function getLgColumnsClass(columns: GridColumns): string {
  const columnsClassMap: Record<GridColumns, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    12: "lg:grid-cols-12",
  };
  return columnsClassMap[columns];
}

const BaseGrid = forwardRef<HTMLDivElement, BaseGridProps>(
  (
    {
      className,
      columns = 1,
      smColumns,
      mdColumns,
      lgColumns,
      gap = "md",
      align = "stretch",
      justify = "stretch",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          getColumnsClass(columns),
          smColumns && getSmColumnsClass(smColumns),
          mdColumns && getMdColumnsClass(mdColumns),
          lgColumns && getLgColumnsClass(lgColumns),
          gap === "xs" && "gap-1",
          gap === "sm" && "gap-2",
          gap === "md" && "gap-4",
          gap === "lg" && "gap-6",
          gap === "xl" && "gap-8",
          align === "start" && "items-start",
          align === "center" && "items-center",
          align === "end" && "items-end",
          align === "stretch" && "items-stretch",
          justify === "start" && "justify-items-start",
          justify === "center" && "justify-items-center",
          justify === "end" && "justify-items-end",
          justify === "stretch" && "justify-items-stretch",
          className,
        )}
        data-columns={String(columns)}
        data-sm-columns={smColumns ? String(smColumns) : undefined}
        data-md-columns={mdColumns ? String(mdColumns) : undefined}
        data-lg-columns={lgColumns ? String(lgColumns) : undefined}
        data-gap={gap}
        data-align={align}
        data-justify={justify}
        {...props}
      />
    );
  },
);

BaseGrid.displayName = "Grid";

export type GridProps = BaseGridProps;

const Grid = forwardRef<HTMLDivElement, GridProps>(({ className, ...props }, ref) => {
  return <BaseGrid ref={ref} className={cn("min-w-0", className)} {...props} />;
});

Grid.displayName = "Grid";

export default Grid;
