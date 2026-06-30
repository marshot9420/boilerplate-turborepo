import Link from "next/link";

import { URLS } from "@/constants";
import { LogoutButton } from "@/features/auth";

const navigationItems = [
  {
    label: "홈",
    href: URLS.CLIENT.HOME,
  },
  {
    label: "콘텐츠",
    href: URLS.CLIENT.CONTENTS,
  },
] as const;

export interface HeaderViewProps {
  isAuthenticated?: boolean;
}

export default function HeaderView({ isAuthenticated = false }: HeaderViewProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-(--color-border) bg-(--color-background)/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={URLS.CLIENT.HOME} className="text-base font-semibold tracking-tight">
          Web
        </Link>

        <nav aria-label="주요 메뉴" className="hidden items-center gap-6 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground text-sm font-medium transition-colors hover:text-(--color-foreground)"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href={URLS.CLIENT.MY_PAGE}
                className="text-muted-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-(--color-foreground)"
              >
                마이페이지
              </Link>

              <LogoutButton />
            </>
          ) : (
            <Link
              href={URLS.CLIENT.LOGIN}
              className="text-muted-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-(--color-foreground)"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
