import type { ReactNode } from "react";

import { Card, Separator } from "@repo/design-system/admin";

export interface AuthCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  description?: string;
  footer?: ReactNode;
}

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function AuthCard({
  title,
  children,
  className,
  description,
  footer,
}: AuthCardProps) {
  return (
    <Card variant="elevated" className={mergeClassNames("w-full p-6 sm:p-8", className)}>
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">{title}</h1>

        {description ? (
          <p className="text-muted-foreground text-sm leading-6">{description}</p>
        ) : null}
      </div>

      <Separator spacing="lg" />

      {children}

      {footer ? (
        <>
          <Separator spacing="lg" />
          {footer}
        </>
      ) : null}
    </Card>
  );
}
