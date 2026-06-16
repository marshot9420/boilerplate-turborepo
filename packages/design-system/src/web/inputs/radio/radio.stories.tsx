import type { Meta, StoryObj } from "@storybook/react-vite";

import Radio from "./radio";

const meta = {
  title: "Web/Inputs/Radio",
  component: Radio,
  args: {
    "aria-label": "옵션",
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Radio>;

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
        <Radio aria-label="작은 라디오" size="sm" />
        <Radio aria-label="기본 라디오" size="md" />
        <Radio aria-label="큰 라디오" size="lg" />
      </div>
    );
  },
} satisfies Story;

export const Group = {
  render: () => {
    return (
      <fieldset className="flex w-80 flex-col gap-3">
        <legend className="text-foreground mb-1 text-sm font-medium">요금제 선택</legend>

        <label className="text-foreground flex items-center gap-2 text-sm">
          <Radio name="plan" value="basic" defaultChecked />
          Basic
        </label>

        <label className="text-foreground flex items-center gap-2 text-sm">
          <Radio name="plan" value="pro" />
          Pro
        </label>

        <label className="text-foreground flex items-center gap-2 text-sm">
          <Radio name="plan" value="enterprise" />
          Enterprise
        </label>
      </fieldset>
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
