import type { Meta, StoryObj } from "@storybook/react-vite";

import Checkbox from "./checkbox";

const meta = {
  title: "Admin/Inputs/Checkbox",
  component: Checkbox,
  args: {
    "aria-label": "선택",
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Checked = {
  args: {
    defaultChecked: true,
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex items-center gap-4">
        <Checkbox aria-label="작은 체크박스" size="sm" />
        <Checkbox aria-label="기본 체크박스" size="md" />
        <Checkbox aria-label="큰 체크박스" size="lg" />
      </div>
    );
  },
} satisfies Story;

export const WithLabel = {
  render: () => {
    return (
      <label className="text-foreground flex items-center gap-2 text-sm">
        <Checkbox />
        관리자 권한을 부여합니다.
      </label>
    );
  },
} satisfies Story;

export const Invalid = {
  args: {
    hasError: true,
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;

export const DisabledChecked = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
} satisfies Story;
