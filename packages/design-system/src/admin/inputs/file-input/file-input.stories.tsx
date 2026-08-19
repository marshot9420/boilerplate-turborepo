import type { Meta, StoryObj } from "@repo/storybook-config/react";

import FileInput from "./file-input";

const meta = {
  title: "Admin/Inputs/FileInput",
  component: FileInput,
  args: {
    "aria-label": "파일 선택",
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FileInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex w-80 flex-col gap-4">
        <FileInput aria-label="작은 파일 선택" size="sm" />
        <FileInput aria-label="기본 파일 선택" size="md" />
        <FileInput aria-label="큰 파일 선택" size="lg" />
      </div>
    );
  },
} satisfies Story;

export const ImageOnly = {
  args: {
    accept: "image/png,image/jpeg,image/webp",
  },
} satisfies Story;

export const Multiple = {
  args: {
    multiple: true,
  },
} satisfies Story;

export const WithLabel = {
  render: () => {
    return (
      <label className="text-foreground flex w-80 flex-col gap-2 text-sm font-medium">
        첨부 파일
        <FileInput accept="image/png,image/jpeg" />
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
