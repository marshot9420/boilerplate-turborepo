"use client";

import { forwardRef } from "react";

import {
  Radio as PrimitiveRadio,
  type RadioProps as PrimitiveRadioProps,
} from "../../../primitives/inputs/radio";
import { cn } from "../../../utils";

export type RadioProps = PrimitiveRadioProps;

const Radio = forwardRef<HTMLInputElement, RadioProps>(({ className, ...props }, ref) => {
  return (
    <PrimitiveRadio
      ref={ref}
      className={cn(
        "border-border bg-surface accent-primary shadow-xs",
        "checked:border-primary",
        "md:hover:border-primary/60",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "focus-visible:border-ring",
        "data-[invalid=true]:border-destructive",
        "data-[disabled=true]:bg-muted",
        className,
      )}
      {...props}
    />
  );
});

Radio.displayName = "Radio";

export default Radio;
