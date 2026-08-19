import type { Meta, StoryObj } from "@repo/storybook-config/react";

import DataList, { DataListItem, DataListLabel, DataListValue } from "./data-list";

const meta = {
  title: "Admin/Data Display/DataList",
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
            <DataListLabel>권한</DataListLabel>
            <DataListValue>ADMIN</DataListValue>
          </DataListItem>

          <DataListItem>
            <DataListLabel>상태</DataListLabel>
            <DataListValue>ACTIVE</DataListValue>
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
            <DataListLabel>EMAIL</DataListLabel>
            <DataListValue>marshot@example.com</DataListValue>
          </DataListItem>

          <DataListItem>
            <DataListLabel>NICKNAME</DataListLabel>
            <DataListValue>MARSHOT</DataListValue>
          </DataListItem>

          <DataListItem>
            <DataListLabel>MEMO</DataListLabel>
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
            <DataListLabel>PROJECT</DataListLabel>
            <DataListValue>Turborepo Boilerplate</DataListValue>
          </DataListItem>

          <DataListItem orientation="horizontal">
            <DataListLabel>STACK</DataListLabel>
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
              <DataListLabel>{size.toUpperCase()}</DataListLabel>
              <DataListValue>DataList size {size}</DataListValue>
            </DataListItem>
          </DataList>
        ))}
      </div>
    );
  },
} satisfies Story;
