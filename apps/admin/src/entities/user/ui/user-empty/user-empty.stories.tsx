import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import UserEmpty from "./user-empty";

const meta = {
  title: "Entities/User/UserEmpty",
  component: UserEmpty,
  args: {
    title: "조회된 사용자가 없습니다.",
    description: "검색어나 필터 조건을 변경해서 다시 조회해 보세요.",
  },
} satisfies Meta<typeof UserEmpty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomMessage: Story = {
  args: {
    title: "조건에 맞는 관리자가 없습니다.",
    description: "권한 필터를 변경하거나 검색어를 초기화해 주세요.",
  },
};
