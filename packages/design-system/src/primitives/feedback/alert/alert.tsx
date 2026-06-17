"use client";

import {
  createElement,
  forwardRef,
  type AriaRole,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../../../utils";

export type AlertTone = "default" | "info" | "success" | "warning" | "danger";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  icon?: ReactNode;
  role?: AriaRole;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone = "default", icon, role, children, ...props }, ref) => {
    const resolvedRole = role ?? (tone === "danger" ? "alert" : "status");

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg border p-4 text-sm",
          "bg-surface text-surface-foreground",
          tone === "default" && "border-border",
          tone === "info" && "border-border bg-muted/40",
          tone === "success" && "border-border bg-muted/40",
          tone === "warning" && "border-border bg-muted/40",
          tone === "danger" && "border-destructive/50 text-destructive",
          className,
        )}
        role={resolvedRole}
        data-tone={tone}
        {...props}
      >
        {icon ? (
          <div
            className="absolute top-4 left-4 flex size-5 items-center justify-center"
            aria-hidden="true"
            data-slot="alert-icon"
          >
            {icon}
          </div>
        ) : null}

        <div className={cn(icon && "pl-7")}>{children}</div>
      </div>
    );
  },
);

Alert.displayName = "Alert";

export type AlertTitleElement = "p" | "h2" | "h3" | "h4" | "h5";

export interface AlertTitleProps extends HTMLAttributes<HTMLElement> {
  as?: AlertTitleElement;
}

export const AlertTitle = forwardRef<HTMLElement, AlertTitleProps>(
  ({ as: TitleElement = "h5", className, ...props }, ref) => {
    return createElement(TitleElement, {
      ref,
      className: cn("mb-1 leading-none font-medium tracking-tight", className),
      "data-title-element": TitleElement,
      ...props,
    });
  },
);

AlertTitle.displayName = "AlertTitle";

export type AlertDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-muted-foreground text-sm leading-relaxed", className)}
        {...props}
      />
    );
  },
);

AlertDescription.displayName = "AlertDescription";

export type AlertActionsProps = HTMLAttributes<HTMLDivElement>;

export const AlertActions = forwardRef<HTMLDivElement, AlertActionsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-3 flex flex-wrap items-center gap-2", className)}
        {...props}
      />
    );
  },
);

AlertActions.displayName = "AlertActions";

export default Alert;
