import type { Meta, StoryObj } from "@repo/storybook-config/react";

import DataList, { DataListItem, DataListLabel, DataListValue } from "./data-list";

const meta = {
  title: "Web/Data Display/DataList",
  component: DataList,
  parameters: {
    layout: "centered",
  },
  args: {
    size: "md",
    divided: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    divided: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof DataList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  render: (args) => {
    return (
      <div className="w-md max-w-full">
        <DataList {...args}>
          <DataListItem>
            <DataListLabel>이름</DataListLabel>
            <DataListValue>MARSHOT</DataListValue>
          </DataListItem>

          <DataListItem>
            <DataListLabel>역할</DataListLabel>
            <DataListValue>소프트웨어 엔지니어</DataListValue>
          </DataListItem>

          <DataListItem>
            <DataListLabel>상태</DataListLabel>
            <DataListValue>활성</DataListValue>
          </DataListItem>
        </DataList>
      </div>
    );
  },
} satisfies Story;

export const Divided = {
  args: {
    divided: true,
  },
  render: (args) => {
    return (
      <div className="w-md max-w-full">
        <DataList {...args}>
          <DataListItem>
            <DataListLabel>이메일</DataListLabel>
            <DataListValue>marshot@example.com</DataListValue>
          </DataListItem>

          <DataListItem>
            <DataListLabel>닉네임</DataListLabel>
            <DataListValue>MARSHOT</DataListValue>
          </DataListItem>

          <DataListItem>
            <DataListLabel>메모</DataListLabel>
            <DataListValue />
          </DataListItem>
        </DataList>
      </div>
    );
  },
} satisfies Story;

export const Horizontal = {
  render: (args) => {
    return (
      <div className="w-lg max-w-full">
        <DataList {...args}>
          <DataListItem orientation="horizontal">
            <DataListLabel>프로젝트</DataListLabel>
            <DataListValue>Turborepo Boilerplate</DataListValue>
          </DataListItem>

          <DataListItem orientation="horizontal">
            <DataListLabel>스택</DataListLabel>
            <DataListValue>Next.js, React, Prisma, Tailwind CSS</DataListValue>
          </DataListItem>
        </DataList>
      </div>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    const sizes = ["sm", "md", "lg"] as const;

    return (
      <div className="grid w-lg max-w-full gap-4">
        {sizes.map((size) => (
          <DataList key={size} size={size}>
            <DataListItem>
              <DataListLabel>{size}</DataListLabel>
              <DataListValue>DataList size {size}</DataListValue>
            </DataListItem>
          </DataList>
        ))}
      </div>
    );
  },
} satisfies Story;
