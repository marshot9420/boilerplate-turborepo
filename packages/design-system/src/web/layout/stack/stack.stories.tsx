import type { Meta, StoryObj } from "@storybook/react-vite";

import Stack from "./stack";

const meta = {
  title: "Web/Layout/Stack",
  component: Stack,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

const Box = ({ label }: { label: string }) => {
  return (
    <div className="border-border bg-surface text-foreground rounded-md border px-4 py-3 text-sm">
      {label}
    </div>
  );
};

export const Default = {
  render: () => {
    return (
      <Stack className="w-80">
        <Box label="웹 항목 1" />
        <Box label="웹 항목 2" />
        <Box label="웹 항목 3" />
      </Stack>
    );
  },
} satisfies Story;

export const Horizontal = {
  render: () => {
    return (
      <Stack direction="horizontal" align="center">
        <Box label="시작하기" />
        <Box label="자세히 보기" />
      </Stack>
    );
  },
} satisfies Story;

export const Gaps = {
  render: () => {
    return (
      <Stack gap="xl" className="w-80">
        <Box label="gap=xl" />
        <Box label="gap=xl" />
        <Box label="gap=xl" />
      </Stack>
    );
  },
} satisfies Story;

export const JustifyBetween = {
  render: () => {
    return (
      <Stack
        direction="horizontal"
        align="center"
        justify="between"
        fullWidth
        className="border-border bg-surface w-96 rounded-md border p-4"
      >
        <span className="text-foreground text-sm font-medium">요금제</span>
        <Box label="Pro" />
      </Stack>
    );
  },
} satisfies Story;

export const Wrap = {
  render: () => {
    return (
      <Stack direction="horizontal" gap="sm" wrap className="w-72">
        <Box label="태그" />
        <Box label="프로필" />
        <Box label="설정" />
        <Box label="알림" />
        <Box label="계정" />
      </Stack>
    );
  },
} satisfies Story;
