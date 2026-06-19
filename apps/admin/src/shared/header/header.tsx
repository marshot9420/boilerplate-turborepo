import type { ReactNode } from "react";

import { Container } from "@repo/design-system/admin";

export interface HeaderProps {
  actions?: ReactNode;
}

export default function Header({ actions }: HeaderProps) {
  return (
    <header className="border-border bg-background/95 sticky top-0 z-10 border-b backdrop-blur">
      <Container size="full" padding="md" className="flex h-16 items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold">Boilerplate</p>
        </div>

        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </Container>
    </header>
  );
}
