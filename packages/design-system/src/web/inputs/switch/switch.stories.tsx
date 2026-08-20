import type { Meta, StoryObj } from "@repo/storybook-config/react";

import Switch from "./switch";

const meta = {
  title: "Web/Inputs/Switch",
  component: Switch,
  args: {
    "aria-label": "설정",
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

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
        <Switch aria-label="작은 스위치" size="sm" />
        <Switch aria-label="기본 스위치" size="md" />
        <Switch aria-label="큰 스위치" size="lg" />
      </div>
    );
  },
} satisfies Story;

export const WithLabel = {
  render: () => {
    return (
      <label className="text-foreground flex w-80 items-center justify-between gap-4 text-sm font-medium">
        마케팅 정보 수신
        <Switch name="marketing" />
      </label>
    );
  },
} satisfies Story;

export const Settings = {
  render: () => {
    return (
      <div className="flex w-80 flex-col gap-4">
        <label className="text-foreground flex items-center justify-between gap-4 text-sm">
          이메일 알림
          <Switch name="emailNotification" defaultChecked />
        </label>

        <label className="text-foreground flex items-center justify-between gap-4 text-sm">
          마케팅 정보 수신
          <Switch name="marketing" />
        </label>

        <label className="text-foreground flex items-center justify-between gap-4 text-sm">
          프로필 공개
          <Switch name="publicProfile" defaultChecked />
        </label>
      </div>
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
