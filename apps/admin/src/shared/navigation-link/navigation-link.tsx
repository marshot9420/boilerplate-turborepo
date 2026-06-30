"use client";

import { usePathname } from "next/navigation";

import { SidebarNavLink } from "@repo/design-system/admin";

import { URLS, type NavigationItem } from "@/constants";

export interface NavigationLinkProps {
  item: NavigationItem;
}

function isActivePath(pathname: string, href: string) {
  if (href === URLS.CLIENT.HOME) {
    return pathname === URLS.CLIENT.HOME;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavigationLink({ item }: NavigationLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);

  return (
    <SidebarNavLink
      href={item.href}
      active={active}
      aria-current={active ? "page" : undefined}
      aria-label={item.label}
    >
      <span className="block truncate">{item.label}</span>
      <span className="text-muted-foreground mt-0.5 block truncate text-xs">
        {item.description}
      </span>
    </SidebarNavLink>
  );
}
