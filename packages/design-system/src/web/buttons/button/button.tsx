import { cva, type VariantProps } from "class-variance-authority";

import { type ComponentPropsWithoutRef } from "react";

import { Button as ButtonPrimitive } from "../../../primitives/buttons/button/button";
import { cn } from "../../../utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-xl text-sm font-medium transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-muted text-foreground hover:bg-muted/80",
        outline:
          "border border-border bg-background text-foreground hover:bg-muted",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-6 text-base",
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
      "className" | "variant" | "size" | "fullWidth"
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
      data-variant={variant ?? "primary"}
      data-size={size ?? "md"}
      data-full-width={fullWidth ? "true" : "false"}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}
