import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarNav,
  SidebarNavItem,
  SidebarNavList,
  SidebarSeparator,
} from "@repo/design-system/admin";

import { NAVIGATION_ITEMS, type NavigationItem } from "@/constants";
import { NavigationLink } from "@/shared/navigation-link";

export interface SidebarUser {
  email: string;
  nickname: string | null;
}

export interface SidebarProps {
  user?: SidebarUser;
  navigationItems?: readonly NavigationItem[];
}

export default function Sidebar({ user, navigationItems = NAVIGATION_ITEMS }: SidebarProps) {
  const displayName = user ? (user.nickname ?? user.email) : null;

  return (
    <SidebarRoot>
      <SidebarHeader>
        <div className="min-w-0 px-1">
          <p className="truncate text-base font-semibold tracking-tight">Boilerplate</p>
          <p className="text-muted-foreground mt-1 text-xs">Management Console</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNav aria-label="주요 메뉴">
          <SidebarGroup>
            <SidebarNavList>
              {navigationItems.map((item) => (
                <SidebarNavItem key={item.href}>
                  <NavigationLink item={item} />
                </SidebarNavItem>
              ))}
            </SidebarNavList>
          </SidebarGroup>
        </SidebarNav>
      </SidebarContent>

      {user ? (
        <>
          <SidebarSeparator />

          <SidebarFooter>
            <div className="min-w-0 px-1">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="text-muted-foreground mt-1 truncate text-xs">{user.email}</p>
            </div>
          </SidebarFooter>
        </>
      ) : null}
    </SidebarRoot>
  );
}
