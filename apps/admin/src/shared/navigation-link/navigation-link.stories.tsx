import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import { URLS } from "@/constants";

import NavigationLink from "./navigation-link";

const meta = {
  title: "Shared/NavigationLink",
  component: NavigationLink,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: URLS.CLIENT.CONTENTS,
      },
    },
  },
} satisfies Meta<typeof NavigationLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: {
      href: URLS.CLIENT.CONTENTS,
      label: "콘텐츠",
      description: "콘텐츠 관리",
    },
  },
};

export const Inactive: Story = {
  args: {
    item: {
      href: URLS.CLIENT.USERS,
      label: "사용자",
      description: "사용자 관리",
    },
  },
};
