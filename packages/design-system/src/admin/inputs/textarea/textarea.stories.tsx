import type { Meta, StoryObj } from "@repo/storybook-config/react";

import Textarea from "./textarea";

const meta = {
  title: "Admin/Inputs/Textarea",
  component: Textarea,
  args: {
    "aria-label": "내용",
    placeholder: "내용을 입력해 주세요.",
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    className: "w-80",
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex w-80 flex-col gap-4">
        <Textarea aria-label="작은 텍스트 영역" size="sm" placeholder="Small" />
        <Textarea aria-label="기본 텍스트 영역" size="md" placeholder="Medium" />
        <Textarea aria-label="큰 텍스트 영역" size="lg" placeholder="Large" />
      </div>
    );
  },
} satisfies Story;

export const ResizeModes = {
  render: () => {
    return (
      <div className="flex w-80 flex-col gap-4">
        <Textarea aria-label="리사이즈 없음" resize="none" placeholder="None" />
        <Textarea aria-label="세로 리사이즈" resize="vertical" placeholder="Vertical" />
        <Textarea aria-label="가로 리사이즈" resize="horizontal" placeholder="Horizontal" />
        <Textarea aria-label="전체 리사이즈" resize="both" placeholder="Both" />
      </div>
    );
  },
} satisfies Story;

export const WithValue = {
  args: {
    className: "w-80",
    defaultValue: "관리자 메모입니다.",
  },
} satisfies Story;

export const WithLabel = {
  render: () => {
    return (
      <label className="text-foreground flex w-80 flex-col gap-2 text-sm font-medium">
        관리자 메모
        <Textarea name="memo" rows={5} maxLength={500} placeholder="관리자 메모를 입력해 주세요." />
      </label>
    );
  },
} satisfies Story;

export const Invalid = {
  args: {
    className: "w-80",
    hasError: true,
    defaultValue: "검증에 실패한 내용입니다.",
  },
} satisfies Story;

export const Disabled = {
  args: {
    className: "w-80",
    disabled: true,
    placeholder: "비활성화된 입력",
  },
} satisfies Story;

export const ReadOnly = {
  args: {
    className: "w-80",
    readOnly: true,
    value: "읽기 전용 내용입니다.",
  },
} satisfies Story;
