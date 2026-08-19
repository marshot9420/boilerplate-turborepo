import type { Meta, StoryObj } from "@repo/storybook-config/react";

import FieldLabel from "./field-label";

const meta = {
  title: "Admin/Form/FieldLabel",
  component: FieldLabel,
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
    },
    weight: {
      control: "inline-radio",
      options: ["medium", "semibold"],
    },
    required: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    hasError: {
      control: "boolean",
    },
  },
  args: {
    size: "md",
    weight: "medium",
    required: false,
    disabled: false,
    hasError: false,
    children: "관리자 필드",
  },
} satisfies Meta<typeof FieldLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
    children: "제목",
  },
};

export const RequiredSlot: Story = {
  args: {
    required: true,
    requiredSlot: "(필수)",
    children: "제목",
  },
};

export const Invalid: Story = {
  args: {
    hasError: true,
    required: true,
    children: "제목",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "비활성 필드",
  },
};

export const Sizes: Story = {
  render: () => {
    return (
      <div className="grid gap-4">
        <FieldLabel size="sm">Small Label</FieldLabel>
        <FieldLabel size="md">Medium Label</FieldLabel>
      </div>
    );
  },
};

export const WithField: Story = {
  render: () => {
    return (
      <div className="grid max-w-md gap-2">
        <FieldLabel htmlFor="admin-label-demo" required>
          제목
        </FieldLabel>
        <input
          id="admin-label-demo"
          className="border-input bg-background h-10 rounded-md border px-3 text-sm"
          placeholder="제목을 입력해 주세요"
          required
        />
      </div>
    );
  },
};
