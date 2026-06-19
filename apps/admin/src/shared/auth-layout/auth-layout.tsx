import type { ReactNode } from "react";

export interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
