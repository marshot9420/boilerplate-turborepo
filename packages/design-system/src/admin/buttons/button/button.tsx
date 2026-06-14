import { cva, type VariantProps } from "class-variance-authority";

import { type ComponentPropsWithoutRef } from "react";

import { Button as ButtonPrimitive } from "../../../primitives/button";
import { cn } from "../../../utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
    "rounded-md border text-sm font-medium transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none",
  ],
  {
    variants: {
      variant: {
        primary: "border-primary bg-primary text-primary-foreground",
        secondary: "border-border bg-secondary text-secondary-foreground",
        outline: "border-border bg-background hover:bg-muted",
        ghost: "border-transparent bg-transparent hover:bg-muted",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-sm",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends
    Omit<
      ComponentPropsWithoutRef<typeof ButtonPrimitive>,
      "className" | "variant" | "size"
    >,
    VariantProps<typeof buttonVariants> {
  className?: string;
}

export default function Button({
  className,
  variant,
  size,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}
