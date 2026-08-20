import type { Meta, StoryObj } from "@repo/storybook-config/react";

import Select from "./select";

const meta = {
  title: "Web/Inputs/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

const planOptions = (
  <>
    <option value="">요금제를 선택해 주세요</option>
    <option value="basic">Basic</option>
    <option value="pro">Pro</option>
    <option value="enterprise">Enterprise</option>
  </>
);

export const Default = {
  render: () => {
    return (
      <Select aria-label="요금제" className="w-80" defaultValue="">
        {planOptions}
      </Select>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex w-80 flex-col gap-4">
        <Select aria-label="작은 선택" size="sm" defaultValue="">
          {planOptions}
        </Select>
        <Select aria-label="기본 선택" size="md" defaultValue="">
          {planOptions}
        </Select>
        <Select aria-label="큰 선택" size="lg" defaultValue="">
          {planOptions}
        </Select>
      </div>
    );
  },
} satisfies Story;

export const WithValue = {
  render: () => {
    return (
      <Select aria-label="요금제" className="w-80" defaultValue="pro">
        {planOptions}
      </Select>
    );
  },
} satisfies Story;

export const WithLabel = {
  render: () => {
    return (
      <label className="text-foreground flex w-80 flex-col gap-2 text-sm font-medium">
        요금제
        <Select name="plan" defaultValue="">
          {planOptions}
        </Select>
      </label>
    );
  },
} satisfies Story;

export const Invalid = {
  render: () => {
    return (
      <Select aria-label="요금제" className="w-80" hasError defaultValue="">
        {planOptions}
      </Select>
    );
  },
} satisfies Story;

export const Disabled = {
  render: () => {
    return (
      <Select aria-label="요금제" className="w-80" disabled defaultValue="basic">
        {planOptions}
      </Select>
    );
  },
} satisfies Story;
