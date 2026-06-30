import type { ReactNode } from "react";

import { SidebarLayout } from "@repo/design-system/admin";

import { Footer } from "@/shared/footer";
import { Header } from "@/shared/header";
import { Main } from "@/shared/main";
import { Sidebar, type SidebarUser } from "@/shared/sidebar";

export interface LayoutProps {
  children: ReactNode;
  user?: SidebarUser;
  headerActions?: ReactNode;
}

export default function Layout({ children, user, headerActions }: LayoutProps) {
  return (
    <SidebarLayout className="min-h-screen">
      <Sidebar user={user} />

      <div className="bg-background flex min-h-screen min-w-0 flex-1 flex-col">
        <Header actions={headerActions} />
        <Main>{children}</Main>
        <Footer />
      </div>
    </SidebarLayout>
  );
}
