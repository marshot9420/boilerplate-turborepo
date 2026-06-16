"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { useState } from "react";

import TextCounter from "./text-counter";

function TextCounterFieldDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="grid max-w-md gap-2">
      <label className="text-sm font-medium" htmlFor="admin-text-counter-demo">
        관리자 메모
      </label>

      <textarea
        id="admin-text-counter-demo"
        className="border-input bg-background min-h-24 rounded-md border px-3 py-2 text-sm"
        maxLength={120}
        placeholder="메모를 입력해 주세요"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />

      <TextCounter value={value} maxLength={120} fullWidth />
    </div>
  );
}

const meta = {
  title: "Admin/Form/TextCounter",
  component: TextCounter,
  argTypes: {
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
    },
    weight: {
      control: "inline-radio",
      options: ["normal", "medium"],
    },
    fullWidth: {
      control: "boolean",
    },
    value: {
      control: "text",
    },
    count: {
      control: "number",
    },
    maxLength: {
      control: "number",
    },
  },
  args: {
    value: "관리자 메모",
    maxLength: 50,
    align: "end",
    size: "sm",
    weight: "normal",
    fullWidth: false,
  },
} satisfies Meta<typeof TextCounter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CountOnly: Story = {
  args: {
    value: undefined,
    count: 24,
    maxLength: undefined,
  },
};

export const OverLimit: Story = {
  args: {
    value: undefined,
    count: 64,
    maxLength: 50,
    weight: "medium",
  },
};

export const Alignments: Story = {
  render: () => {
    return (
      <div className="grid max-w-md gap-4">
        <TextCounter value="start" maxLength={20} align="start" fullWidth />
        <TextCounter value="center" maxLength={20} align="center" fullWidth />
        <TextCounter value="end" maxLength={20} align="end" fullWidth />
      </div>
    );
  },
};

export const WithField: Story = {
  render: () => {
    return <TextCounterFieldDemo />;
  },
};
