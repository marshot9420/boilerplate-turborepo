import type { Meta, StoryObj } from "@repo/storybook-config/react";

import FieldError from "./field-error";

const meta = {
  title: "Web/Form/FieldError",
  component: FieldError,
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
    },
    message: {
      control: "text",
    },
  },
  args: {
    size: "md",
    message: "올바른 이메일 형식이 아닙니다.",
  },
} satisfies Meta<typeof FieldError>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
    message: "작은 크기의 에러 메시지입니다.",
  },
};

export const Children: Story = {
  args: {
    message: undefined,
    children: "children으로 전달된 에러 메시지입니다.",
  },
};

export const WithField: Story = {
  render: () => {
    return (
      <div className="grid max-w-md gap-2">
        <label className="text-sm font-medium" htmlFor="web-error-demo">
          이메일
        </label>
        <input
          id="web-error-demo"
          className="border-destructive bg-background h-10 rounded-md border px-3 text-sm"
          placeholder="이메일을 입력해 주세요"
          aria-invalid="true"
        />
        <FieldError>올바른 이메일 형식이 아닙니다.</FieldError>
      </div>
    );
  },
};
