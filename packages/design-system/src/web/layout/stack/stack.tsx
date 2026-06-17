"use client";

import { forwardRef } from "react";

import {
  Stack as PrimitiveStack,
  type StackProps as PrimitiveStackProps,
} from "../../../primitives/layout/stack";
import { cn } from "../../../utils";

export type StackProps = PrimitiveStackProps;

const Stack = forwardRef<HTMLDivElement, StackProps>(({ className, ...props }, ref) => {
  return <PrimitiveStack ref={ref} className={cn("min-w-0", className)} {...props} />;
});

Stack.displayName = "Stack";

export default Stack;
