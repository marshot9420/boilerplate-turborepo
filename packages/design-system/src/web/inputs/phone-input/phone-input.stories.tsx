import type { Meta, StoryObj } from "@repo/storybook-config/react";

import PhoneInput from "./phone-input";

const meta = {
  title: "Web/Inputs/PhoneInput",
  component: PhoneInput,
  args: {
    "aria-label": "전화번호",
    placeholder: "010-0000-0000",
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PhoneInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex w-80 flex-col gap-4">
        <PhoneInput aria-label="작은 전화번호 입력" size="sm" placeholder="Small" />
        <PhoneInput aria-label="기본 전화번호 입력" size="md" placeholder="Medium" />
        <PhoneInput aria-label="큰 전화번호 입력" size="lg" placeholder="Large" />
      </div>
    );
  },
} satisfies Story;

export const WithValue = {
  args: {
    defaultValue: "01012345678",
  },
} satisfies Story;

export const WithPrefix = {
  args: {
    prefixSlot: "+82",
    placeholder: "10-0000-0000",
  },
} satisfies Story;

export const WithSuffix = {
  args: {
    suffixSlot: "인증",
  },
} satisfies Story;

export const WithLabel = {
  render: () => {
    return (
      <label className="text-foreground flex w-80 flex-col gap-2 text-sm font-medium">
        휴대폰 번호
        <PhoneInput name="phone" prefixSlot="+82" suffixSlot="인증" placeholder="10-0000-0000" />
      </label>
    );
  },
} satisfies Story;

export const Invalid = {
  args: {
    hasError: true,
    defaultValue: "123",
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
    value: "01012345678",
  },
} satisfies Story;
