import type { Meta, StoryObj } from "@repo/storybook-config/react";

import FieldDescription from "./field-description";

const meta = {
  title: "Admin/Form/FieldDescription",
  component: FieldDescription,
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
    },
    tone: {
      control: "inline-radio",
      options: ["default", "subtle"],
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    size: "md",
    tone: "default",
    disabled: false,
    children: "관리자 화면에서 필드 입력을 보조하는 설명 문구입니다.",
  },
} satisfies Meta<typeof FieldDescription>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
    children: "작은 크기의 보조 설명 문구입니다.",
  },
};

export const Subtle: Story = {
  args: {
    tone: "subtle",
    children: "조금 더 약한 강조의 보조 설명 문구입니다.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "비활성화된 필드의 보조 설명 문구입니다.",
  },
};

export const WithField: Story = {
  render: () => {
    return (
      <div className="grid max-w-md gap-2">
        <label className="text-sm font-medium" htmlFor="admin-description-demo">
          관리자 메모
        </label>
        <textarea
          id="admin-description-demo"
          className="border-input bg-background min-h-24 rounded-md border px-3 py-2 text-sm"
          placeholder="메모를 입력해 주세요"
        />
        <FieldDescription>이 메모는 관리자 내부 화면에서만 표시됩니다.</FieldDescription>
      </div>
    );
  },
};
