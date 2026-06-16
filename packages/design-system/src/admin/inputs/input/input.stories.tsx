import type { Meta, StoryObj } from "@storybook/react-vite";

import Input from "./input";

const meta = {
  title: "Admin/Inputs/Input",
  component: Input,
  args: {
    "aria-label": "이메일",
    placeholder: "email@example.com",
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex w-80 flex-col gap-4">
        <Input aria-label="작은 입력" size="sm" placeholder="Small" />
        <Input aria-label="기본 입력" size="md" placeholder="Medium" />
        <Input aria-label="큰 입력" size="lg" placeholder="Large" />
      </div>
    );
  },
} satisfies Story;

export const WithValue = {
  args: {
    defaultValue: "admin@example.com",
  },
} satisfies Story;

export const WithLabel = {
  render: () => {
    return (
      <label className="text-foreground flex w-80 flex-col gap-2 text-sm font-medium">
        관리자 이메일
        <Input type="email" name="email" autoComplete="email" placeholder="admin@example.com" />
      </label>
    );
  },
} satisfies Story;

export const Password = {
  args: {
    type: "password",
    placeholder: "비밀번호를 입력해 주세요.",
  },
} satisfies Story;

export const Invalid = {
  args: {
    hasError: true,
    defaultValue: "invalid-email",
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
    placeholder: "비활성화된 입력",
  },
} satisfies Story;

export const ReadOnly = {
  args: {
    readOnly: true,
    value: "readonly@example.com",
  },
} satisfies Story;
