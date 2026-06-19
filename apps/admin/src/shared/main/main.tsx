import type { ReactNode } from "react";

import { Container } from "@repo/design-system/admin";

export interface MainProps {
  children: ReactNode;
}

export default function Main({ children }: MainProps) {
  return (
    <main id="main" className="min-w-0 flex-1">
      <Container size="full" padding="md" className="py-6 lg:py-8">
        {children}
      </Container>
    </main>
  );
}
