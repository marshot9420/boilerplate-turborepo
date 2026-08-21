"use client";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export type ContainerPadding = "none" | "sm" | "md" | "lg";

export interface BaseContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  padding?: ContainerPadding;
  centered?: boolean;
}

const BaseContainer = forwardRef<HTMLDivElement, BaseContainerProps>(
  ({ className, size = "xl", padding = "md", centered = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          centered && "mx-auto",
          size === "sm" && "max-w-screen-sm",
          size === "md" && "max-w-3xl",
          size === "lg" && "max-w-5xl",
          size === "xl" && "max-w-7xl",
          size === "2xl" && "max-w-screen-2xl",
          size === "full" && "max-w-none",
          padding === "sm" && "px-4",
          padding === "md" && "px-4 sm:px-6 lg:px-8",
          padding === "lg" && "px-6 sm:px-8 lg:px-10",
          className,
        )}
        data-size={size}
        data-padding={padding}
        data-centered={centered ? "true" : "false"}
        {...props}
      />
    );
  },
);

BaseContainer.displayName = "Container";

export type ContainerProps = BaseContainerProps;

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "full", padding = "md", centered = false, ...props }, ref) => {
    return (
      <BaseContainer
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
