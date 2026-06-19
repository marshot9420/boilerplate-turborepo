import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import { URLS } from "@/constants";

import Sidebar from "./sidebar";

const navigationItems = [
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
] as const;

const meta = {
  title: "Shared/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: URLS.CLIENT.CONTENTS,
      },
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    navigationItems,
  },
};

export const WithUser: Story = {
  args: {
    navigationItems,
    user: {
      email: "admin@example.com",
      nickname: "관리자",
    },
  },
};
