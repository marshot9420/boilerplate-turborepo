"use client";

import { forwardRef } from "react";

import {
  Grid as PrimitiveGrid,
  type GridProps as PrimitiveGridProps,
} from "../../../primitives/layout/grid";
import { cn } from "../../../utils";

export type GridProps = PrimitiveGridProps;

const Grid = forwardRef<HTMLDivElement, GridProps>(({ className, ...props }, ref) => {
  return <PrimitiveGrid ref={ref} className={cn("min-w-0", className)} {...props} />;
});

Grid.displayName = "Grid";

export default Grid;
