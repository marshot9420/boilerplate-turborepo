"use client";

import { cva } from "class-variance-authority";

import {
  forwardRef,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";

import { cn } from "../../../utils";

export type TableTextAlign = "left" | "center" | "right";

export interface BaseTableProps extends TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  fullWidth?: boolean;
}

const BaseTable = forwardRef<HTMLTableElement, BaseTableProps>(
  ({ className, containerClassName, fullWidth = true, children, ...props }, ref) => {
    return (
      <div className={cn("w-full overflow-x-auto", containerClassName)} data-slot="table-container">
        <table
          ref={ref}
          className={cn(
            "caption-bottom border-collapse text-sm",
            fullWidth ? "w-full" : "w-auto",
            className,
          )}
          data-full-width={fullWidth ? "true" : "false"}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },
);

BaseTable.displayName = "Table";

export type BaseTableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

const BaseTableHeader = forwardRef<HTMLTableSectionElement, BaseTableHeaderProps>(
  ({ className, ...props }, ref) => {
    return <thead ref={ref} className={cn("border-border border-b", className)} {...props} />;
  },
);

BaseTableHeader.displayName = "TableHeader";

export type BaseTableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

const BaseTableBody = forwardRef<HTMLTableSectionElement, BaseTableBodyProps>(
  ({ className, ...props }, ref) => {
    return <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
  },
);

BaseTableBody.displayName = "TableBody";

export type BaseTableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

const BaseTableFooter = forwardRef<HTMLTableSectionElement, BaseTableFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <tfoot
        ref={ref}
        className={cn("border-border bg-muted border-t font-medium", className)}
        {...props}
      />
    );
  },
);

BaseTableFooter.displayName = "TableFooter";

export interface BaseTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

const BaseTableRow = forwardRef<HTMLTableRowElement, BaseTableRowProps>(
  ({ className, selected = false, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "border-border border-b transition-colors",
          "hover:bg-muted/50",
          selected && "bg-muted",
          className,
        )}
        data-selected={selected ? "true" : "false"}
        {...props}
      />
    );
  },
);

BaseTableRow.displayName = "TableRow";

export interface BaseTableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  textAlign?: TableTextAlign;
}

const BaseTableHead = forwardRef<HTMLTableCellElement, BaseTableHeadProps>(
  ({ className, textAlign = "left", scope = "col", ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          "text-muted-foreground h-10 px-3 text-xs font-medium",
          textAlign === "left" && "text-left",
          textAlign === "center" && "text-center",
          textAlign === "right" && "text-right",
          className,
        )}
        scope={scope}
        data-text-align={textAlign}
        {...props}
      />
    );
  },
);

BaseTableHead.displayName = "TableHead";

export interface BaseTableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  textAlign?: TableTextAlign;
}

const BaseTableCell = forwardRef<HTMLTableCellElement, BaseTableCellProps>(
  ({ className, textAlign = "left", ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn(
          "p-3 align-middle",
          textAlign === "left" && "text-left",
          textAlign === "center" && "text-center",
          textAlign === "right" && "text-right",
          className,
        )}
        data-text-align={textAlign}
        {...props}
      />
    );
  },
);

BaseTableCell.displayName = "TableCell";

export type BaseTableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

const BaseTableCaption = forwardRef<HTMLTableCaptionElement, BaseTableCaptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <caption
        ref={ref}
        className={cn("text-muted-foreground mt-4 text-sm", className)}
        {...props}
      />
    );
  },
);

BaseTableCaption.displayName = "TableCaption";

export interface BaseTableEmptyProps extends TdHTMLAttributes<HTMLTableCellElement> {
  colSpan: number;
}

const BaseTableEmpty = forwardRef<HTMLTableCellElement, BaseTableEmptyProps>(
  ({ className, colSpan, children = "표시할 데이터가 없습니다.", ...props }, ref) => {
    return (
      <tr>
        <td
          ref={ref}
          className={cn("text-muted-foreground h-24 p-3 text-center text-sm", className)}
          colSpan={colSpan}
          {...props}
        >
          {children}
        </td>
      </tr>
    );
  },
);

BaseTableEmpty.displayName = "TableEmpty";

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

export type TableProps = BaseTableProps;

export type TableHeaderProps = BaseTableHeaderProps;

export type TableBodyProps = BaseTableBodyProps;

export type TableFooterProps = BaseTableFooterProps;

export type TableRowProps = BaseTableRowProps;

export type TableHeadProps = BaseTableHeadProps;

export type TableCellProps = BaseTableCellProps;

export type TableCaptionProps = BaseTableCaptionProps;

export type TableEmptyProps = BaseTableEmptyProps;

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <BaseTable
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
      <BaseTableHeader
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
      <BaseTableBody
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
      <BaseTableFooter
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
      <BaseTableRow
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
      <BaseTableHead
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
      <BaseTableCell
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
      <BaseTableCaption
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
      <BaseTableEmpty
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
