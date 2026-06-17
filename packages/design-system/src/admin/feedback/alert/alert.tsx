"use client";

import { forwardRef } from "react";

import {
  Alert as PrimitiveAlert,
  AlertActions as PrimitiveAlertActions,
  type AlertActionsProps as PrimitiveAlertActionsProps,
  AlertDescription as PrimitiveAlertDescription,
  type AlertDescriptionProps as PrimitiveAlertDescriptionProps,
  type AlertProps as PrimitiveAlertProps,
  AlertTitle as PrimitiveAlertTitle,
  type AlertTitleProps as PrimitiveAlertTitleProps,
  type AlertTone,
} from "../../../primitives/feedback/alert";
import { cn } from "../../../utils";

const alertToneClassNames: Record<AlertTone, string> = {
  default: "border-border bg-surface text-surface-foreground",
  info: "border-info/30 bg-info/10 text-foreground",
  success: "border-success/30 bg-success/10 text-foreground",
  warning: "border-warning/40 bg-warning/10 text-foreground",
  danger: "border-destructive/40 bg-destructive/10 text-destructive",
};

export type AlertProps = PrimitiveAlertProps;

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone = "default", ...props }, ref) => {
    return (
      <PrimitiveAlert
        ref={ref}
        tone={tone}
        className={cn("rounded-md shadow-sm", alertToneClassNames[tone], className)}
        {...props}
      />
    );
  },
);

Alert.displayName = "Alert";

export type AlertTitleProps = PrimitiveAlertTitleProps;

export const AlertTitle = forwardRef<HTMLElement, AlertTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveAlertTitle
        ref={ref}
        data-slot="alert-title"
        className={cn("text-sm", className)}
        {...props}
      />
    );
  },
);

AlertTitle.displayName = "AlertTitle";

export type AlertDescriptionProps = PrimitiveAlertDescriptionProps;

export const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveAlertDescription
        ref={ref}
        data-slot="alert-description"
        className={cn("text-muted-foreground", className)}
        {...props}
      />
    );
  },
);

AlertDescription.displayName = "AlertDescription";

export type AlertActionsProps = PrimitiveAlertActionsProps;

export const AlertActions = forwardRef<HTMLDivElement, AlertActionsProps>(
  ({ className, ...props }, ref) => {
    return (
      <PrimitiveAlertActions
        ref={ref}
        data-slot="alert-actions"
        className={cn("justify-end", className)}
        {...props}
      />
    );
  },
);

AlertActions.displayName = "AlertActions";

export default Alert;
