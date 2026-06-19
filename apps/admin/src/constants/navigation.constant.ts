import { URLS } from "./urls.constant";

export interface NavigationItem {
  href: string;
  label: string;
  description: string;
}

export const NAVIGATION_ITEMS = [
  {
    href: URLS.CLIENT.HOME,
    label: "대시보드",
    description: "관리자 홈",
  },
  {
    href: URLS.CLIENT.CONTENTS,
    label: "콘텐츠",
    description: "콘텐츠 관리",
  },
  {
    href: URLS.CLIENT.USERS,
    label: "사용자",
    description: "사용자 관리",
  },
  {
    href: URLS.CLIENT.SETTINGS,
    label: "설정",
    description: "관리자 설정",
  },
] as const satisfies readonly NavigationItem[];
