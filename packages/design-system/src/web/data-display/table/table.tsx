"use client";

import { cva } from "class-variance-authority";

import { forwardRef } from "react";

import {
  Table as PrimitiveTable,
  TableBody as PrimitiveTableBody,
  TableCaption as PrimitiveTableCaption,
  TableCell as PrimitiveTableCell,
  TableEmpty as PrimitiveTableEmpty,
  TableFooter as PrimitiveTableFooter,
  TableHead as PrimitiveTableHead,
  TableHeader as PrimitiveTableHeader,
  TableRow as PrimitiveTableRow,
  type TableBodyProps as PrimitiveTableBodyProps,
  type TableCaptionProps as PrimitiveTableCaptionProps,
  type TableCellProps as PrimitiveTableCellProps,
  type TableEmptyProps as PrimitiveTableEmptyProps,
  type TableFooterProps as PrimitiveTableFooterProps,
  type TableHeadProps as PrimitiveTableHeadProps,
  type TableHeaderProps as PrimitiveTableHeaderProps,
  type TableProps as PrimitiveTableProps,
  type TableRowProps as PrimitiveTableRowProps,
} from "../../../primitives/data-display/table";
import { cn } from "../../../utils";

const tableContainerClasses = cva([
  "rounded-2xl",
  "border",
  "border-border",
  "bg-surface",
  "shadow-sm",
]);

const tableClasses = cva(["min-w-full"]);

const tableHeaderClasses = cva(["bg-muted/40"]);

const tableBodyClasses = cva(["bg-surface"]);

const tableFooterClasses = cva(["bg-muted/60"]);

const tableRowClasses = cva(["data-[selected=true]:bg-muted/70", "motion-reduce:transition-none"]);

const tableHeadClasses = cva(["h-11", "text-xs", "font-semibold", "uppercase", "tracking-wide"]);

const tableCellClasses = cva(["h-12"]);

const tableCaptionClasses = cva(["pb-4"]);

const tableEmptyClasses = cva(["h-32"]);

export type TableProps = PrimitiveTableProps;
export type TableHeaderProps = PrimitiveTableHeaderProps;
export type TableBodyProps = PrimitiveTableBodyProps;
export type TableFooterProps = PrimitiveTableFooterProps;
export type TableRowProps = PrimitiveTableRowProps;
export type TableHeadProps = PrimitiveTableHeadProps;
export type TableCellProps = PrimitiveTableCellProps;
export type TableCaptionProps = PrimitiveTableCaptionProps;
export type TableEmptyProps = PrimitiveTableEmptyProps;

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <PrimitiveTable
        ref={ref}
        className={cn(tableClasses(), className)}
        containerClassName={cn(tableContainerClasses(), containerClassName)}
        {...props}
        data-ds-component="table"
      />
    );
  },
);

Table.displayName = "Table";

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveTableHeader
        ref={ref}
        className={cn(tableHeaderClasses(), className)}
        {...props}
        data-ds-component="table-header"
        data-testid="header"
      />
    );
  },
);

TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveTableBody
        ref={ref}
        className={cn(tableBodyClasses(), className)}
        {...props}
        data-ds-component="table-body"
      />
    );
  },
);

TableBody.displayName = "TableBody";

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveTableFooter
        ref={ref}
        className={cn(tableFooterClasses(), className)}
        {...props}
        data-ds-component="table-footer"
      />
    );
  },
);

TableFooter.displayName = "TableFooter";

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveTableRow
        ref={ref}
        className={cn(tableRowClasses(), className)}
        {...props}
        data-ds-component="table-row"
      />
    );
  },
);

TableRow.displayName = "TableRow";

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveTableHead
        ref={ref}
        className={cn(tableHeadClasses(), className)}
        {...props}
        data-ds-component="table-head"
      />
    );
  },
);

TableHead.displayName = "TableHead";

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveTableCell
        ref={ref}
        className={cn(tableCellClasses(), className)}
        {...props}
        data-ds-component="table-cell"
      />
    );
  },
);

TableCell.displayName = "TableCell";

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveTableCaption
        ref={ref}
        className={cn(tableCaptionClasses(), className)}
        {...props}
        data-ds-component="table-caption"
      />
    );
  },
);

TableCaption.displayName = "TableCaption";

export const TableEmpty = forwardRef<HTMLTableCellElement, TableEmptyProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveTableEmpty
        ref={ref}
        className={cn(tableEmptyClasses(), className)}
        {...props}
        data-ds-component="table-empty"
      />
    );
  },
);

TableEmpty.displayName = "TableEmpty";

export default Table;
