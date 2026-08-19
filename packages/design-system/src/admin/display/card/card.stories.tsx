import type { Meta, StoryObj } from "@repo/storybook-config/react";

import Card from "./card";

const meta = {
  title: "Admin/Display/Card",
  component: Card,
  args: {
    children: "관리자 카드 콘텐츠",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "muted", "elevated", "outline"],
    },
    padding: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg"],
    },
    fullWidth: {
      control: "boolean",
    },
    interactive: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    variant: "default",
    padding: "md",
  },
} satisfies Story;

export const Muted = {
  args: {
    variant: "muted",
    children: "보조 정보 카드",
  },
} satisfies Story;

export const Elevated = {
  args: {
    variant: "elevated",
    padding: "lg",
    children: "강조된 관리자 카드",
  },
} satisfies Story;

export const Outline = {
  args: {
    variant: "outline",
    children: "외곽선 중심 카드",
  },
} satisfies Story;

export const Interactive = {
  args: {
    interactive: true,
    children: "클릭 가능한 카드",
  },
} satisfies Story;

export const Variants = {
  render: () => {
    return (
      <div className="grid max-w-4xl gap-4 md:grid-cols-2">
        <Card variant="default">Default</Card>
        <Card variant="muted">Muted</Card>
        <Card variant="elevated">Elevated</Card>
        <Card variant="outline">Outline</Card>
      </div>
    );
  },
} satisfies Story;
