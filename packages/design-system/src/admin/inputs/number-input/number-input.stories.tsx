import type { Meta, StoryObj } from "@repo/storybook-config/react";

import NumberInput from "./number-input";

const meta = {
  title: "Admin/Inputs/NumberInput",
  component: NumberInput,
  args: {
    "aria-label": "가격",
    placeholder: "가격을 입력해 주세요.",
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NumberInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex w-80 flex-col gap-4">
        <NumberInput aria-label="작은 숫자 입력" size="sm" placeholder="Small" />
        <NumberInput aria-label="기본 숫자 입력" size="md" placeholder="Medium" />
        <NumberInput aria-label="큰 숫자 입력" size="lg" placeholder="Large" />
      </div>
    );
  },
} satisfies Story;

export const WithValue = {
  args: {
    defaultValue: 10000,
  },
} satisfies Story;

export const WithRange = {
  args: {
    min: 1,
    max: 100,
    step: 1,
    placeholder: "1부터 100까지",
  },
} satisfies Story;

export const WithLabel = {
  render: () => {
    return (
      <label className="text-foreground flex w-80 flex-col gap-2 text-sm font-medium">
        상품 가격
        <NumberInput name="price" min={0} step={100} placeholder="가격을 입력해 주세요." />
      </label>
    );
  },
} satisfies Story;

export const Quantity = {
  args: {
    inputMode: "numeric",
    min: 1,
    step: 1,
    placeholder: "수량",
  },
} satisfies Story;

export const Invalid = {
  args: {
    hasError: true,
    defaultValue: -1,
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
    value: 10000,
  },
} satisfies Story;
