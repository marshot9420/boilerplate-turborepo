"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";

import { cn } from "../../../utils";

export type TableTextAlign = "left" | "center" | "right";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  fullWidth?: boolean;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
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

Table.displayName = "Table";

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    return <thead ref={ref} className={cn("border-border border-b", className)} {...props} />;
  },
);

TableHeader.displayName = "TableHeader";

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
  },
);

TableBody.displayName = "TableBody";

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
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

TableFooter.displayName = "TableFooter";

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
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

TableRow.displayName = "TableRow";

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  textAlign?: TableTextAlign;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
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

TableHead.displayName = "TableHead";

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  textAlign?: TableTextAlign;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
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

TableCell.displayName = "TableCell";

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
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

TableCaption.displayName = "TableCaption";

export interface TableEmptyProps extends TdHTMLAttributes<HTMLTableCellElement> {
  colSpan: number;
}

export const TableEmpty = forwardRef<HTMLTableCellElement, TableEmptyProps>(
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

TableEmpty.displayName = "TableEmpty";

export default Table;
