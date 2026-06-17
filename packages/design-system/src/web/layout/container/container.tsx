"use client";

import { forwardRef } from "react";

import {
  Container as PrimitiveContainer,
  type ContainerProps as PrimitiveContainerProps,
} from "../../../primitives/layout/container";
import { cn } from "../../../utils";

export type ContainerProps = PrimitiveContainerProps;

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "xl", padding = "md", centered = true, ...props }, ref) => {
    return (
      <PrimitiveContainer
        ref={ref}
        size={size}
        padding={padding}
        centered={centered}
        className={cn("min-w-0", className)}
        {...props}
      />
    );
  },
);

Container.displayName = "Container";

export default Container;
