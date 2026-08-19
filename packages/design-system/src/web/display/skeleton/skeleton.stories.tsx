import type { Meta, StoryObj } from "@repo/storybook-config/react";

import Skeleton from "./skeleton";

const meta = {
  title: "Web/Display/Skeleton",
  component: Skeleton,
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "subtle", "strong"],
    },
    shape: {
      control: "inline-radio",
      options: ["rectangle", "circle", "text"],
    },
    animated: {
      control: "boolean",
    },
  },
  args: {
    variant: "default",
    shape: "rectangle",
    animated: true,
    className: "h-24 w-full",
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Text = {
  args: {
    shape: "text",
    className: "w-64",
  },
} satisfies Story;

export const Circle = {
  args: {
    shape: "circle",
    className: "size-12",
  },
} satisfies Story;

export const NotAnimated = {
  args: {
    animated: false,
    className: "h-24 w-full",
  },
} satisfies Story;

export const ContentLoading = {
  render: () => {
    return (
      <div className="border-border bg-surface grid max-w-md gap-4 rounded-xl border p-4">
        <Skeleton className="aspect-video w-full rounded-xl" />

        <div className="grid gap-2">
          <Skeleton shape="text" className="w-2/3" />
          <Skeleton shape="text" variant="subtle" className="w-full" />
          <Skeleton shape="text" variant="subtle" className="w-4/5" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton shape="circle" className="size-9" />
          <Skeleton shape="text" variant="subtle" className="w-32" />
        </div>
      </div>
    );
  },
} satisfies Story;

export const Variants = {
  render: () => {
    return (
      <div className="grid max-w-md gap-4">
        <Skeleton variant="default" className="h-8 w-full" />
        <Skeleton variant="subtle" className="h-8 w-full" />
        <Skeleton variant="strong" className="h-8 w-full" />
      </div>
    );
  },
} satisfies Story;
