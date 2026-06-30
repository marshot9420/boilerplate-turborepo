import type { ReactNode } from "react";

import { Footer } from "../footer";
import { Header } from "../header";
import { Main } from "../main";

interface ShellProps {
  children: ReactNode;
}

export default function Shell({ children }: ShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-(--color-background) text-(--color-foreground)">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
}
