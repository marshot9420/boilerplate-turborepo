import type { Meta, StoryObj } from "@repo/storybook-config/react";

import Select from "./select";

const meta = {
  title: "Admin/Inputs/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

const contentStatusOptions = (
  <>
    <option value="">상태를 선택해 주세요</option>
    <option value="published">게시</option>
    <option value="hidden">숨김</option>
    <option value="deleted">삭제</option>
  </>
);

export const Default = {
  render: () => {
    return (
      <Select aria-label="상태" className="w-80" defaultValue="">
        {contentStatusOptions}
      </Select>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex w-80 flex-col gap-4">
        <Select aria-label="작은 선택" size="sm" defaultValue="">
          {contentStatusOptions}
        </Select>
        <Select aria-label="기본 선택" size="md" defaultValue="">
          {contentStatusOptions}
        </Select>
        <Select aria-label="큰 선택" size="lg" defaultValue="">
          {contentStatusOptions}
        </Select>
      </div>
    );
  },
} satisfies Story;

export const WithValue = {
  render: () => {
    return (
      <Select aria-label="상태" className="w-80" defaultValue="published">
        {contentStatusOptions}
      </Select>
    );
  },
} satisfies Story;

export const WithLabel = {
  render: () => {
    return (
      <label className="text-foreground flex w-80 flex-col gap-2 text-sm font-medium">
        콘텐츠 상태
        <Select name="status" defaultValue="">
          {contentStatusOptions}
        </Select>
      </label>
    );
  },
} satisfies Story;

export const Invalid = {
  render: () => {
    return (
      <Select aria-label="상태" className="w-80" hasError defaultValue="">
        {contentStatusOptions}
      </Select>
    );
  },
} satisfies Story;

export const Disabled = {
  render: () => {
    return (
      <Select aria-label="상태" className="w-80" disabled defaultValue="published">
        {contentStatusOptions}
      </Select>
    );
  },
} satisfies Story;
