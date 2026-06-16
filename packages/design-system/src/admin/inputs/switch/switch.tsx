"use client";

import { forwardRef } from "react";

import {
  Switch as PrimitiveSwitch,
  type SwitchProps as PrimitiveSwitchProps,
} from "../../../primitives/inputs/switch";
import { cn } from "../../../utils";

export type SwitchProps = PrimitiveSwitchProps;

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, trackClassName, ...props }, ref) => {
    return (
      <PrimitiveSwitch
        ref={ref}
        className={cn(className)}
        trackClassName={cn(
          "bg-muted shadow-inner",
          "after:bg-surface after:shadow-sm",
          "peer-checked:bg-primary",
          "peer-focus-visible:ring-0 peer-focus-visible:ring-offset-0",
          "peer-focus-visible:outline-ring peer-focus-visible:outline peer-focus-visible:outline-2",
          "peer-data-[invalid=true]:ring-destructive",
          trackClassName,
        )}
        {...props}
      />
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
