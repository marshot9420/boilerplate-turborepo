import type { Meta, StoryObj } from "@storybook/react-vite";

import FieldDescription from "./field-description";

const meta = {
  title: "Web/Form/FieldDescription",
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
    children: "서비스 화면에서 필드 입력을 보조하는 설명 문구입니다.",
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
        <label className="text-sm font-medium" htmlFor="web-description-demo">
          닉네임
        </label>
        <input
          id="web-description-demo"
          className="border-input bg-background h-10 rounded-md border px-3 text-sm"
          placeholder="닉네임을 입력해 주세요"
        />
        <FieldDescription>다른 사용자에게 표시되는 이름입니다.</FieldDescription>
      </div>
    );
  },
};
