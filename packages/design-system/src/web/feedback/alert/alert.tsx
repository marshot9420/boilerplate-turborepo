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

export interface BaseAlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  icon?: ReactNode;
  role?: AriaRole;
}

const BaseAlert = forwardRef<HTMLDivElement, BaseAlertProps>(
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

BaseAlert.displayName = "Alert";

export type AlertTitleElement = "p" | "h2" | "h3" | "h4" | "h5";

export interface BaseAlertTitleProps extends HTMLAttributes<HTMLElement> {
  as?: AlertTitleElement;
}

const BaseAlertTitle = forwardRef<HTMLElement, BaseAlertTitleProps>(
  ({ as: TitleElement = "h5", className, ...props }, ref) => {
    return createElement(TitleElement, {
      ref,
      className: cn("mb-1 leading-none font-medium tracking-tight", className),
      "data-title-element": TitleElement,
      ...props,
    });
  },
);

BaseAlertTitle.displayName = "AlertTitle";

export type BaseAlertDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

const BaseAlertDescription = forwardRef<HTMLParagraphElement, BaseAlertDescriptionProps>(
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

BaseAlertDescription.displayName = "AlertDescription";

export type BaseAlertActionsProps = HTMLAttributes<HTMLDivElement>;

const BaseAlertActions = forwardRef<HTMLDivElement, BaseAlertActionsProps>(
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

BaseAlertActions.displayName = "AlertActions";

const alertToneClassNames: Record<AlertTone, string> = {
  default: "border-border/80 bg-surface text-surface-foreground",
  info: "border-info/25 bg-info/10 text-foreground",
  success: "border-success/25 bg-success/10 text-foreground",
  warning: "border-warning/35 bg-warning/10 text-foreground",
  danger: "border-destructive/35 bg-destructive/10 text-destructive",
};

export type AlertProps = BaseAlertProps;

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone = "default", ...props }, ref) => {
    return (
      <BaseAlert
        ref={ref}
        tone={tone}
        className={cn("rounded-xl shadow-sm", alertToneClassNames[tone], className)}
        {...props}
      />
    );
  },
);

Alert.displayName = "Alert";

export type AlertTitleProps = BaseAlertTitleProps;

export const AlertTitle = forwardRef<HTMLElement, AlertTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseAlertTitle
        ref={ref}
        data-slot="alert-title"
        className={cn("text-sm", className)}
        {...props}
      />
    );
  },
);

AlertTitle.displayName = "AlertTitle";

export type AlertDescriptionProps = BaseAlertDescriptionProps;

export const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseAlertDescription
        ref={ref}
        data-slot="alert-description"
        className={cn("text-muted-foreground", className)}
        {...props}
      />
    );
  },
);

AlertDescription.displayName = "AlertDescription";

export type AlertActionsProps = BaseAlertActionsProps;

export const AlertActions = forwardRef<HTMLDivElement, AlertActionsProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseAlertActions ref={ref} data-slot="alert-actions" className={cn(className)} {...props} />
    );
  },
);

AlertActions.displayName = "AlertActions";

export default Alert;
