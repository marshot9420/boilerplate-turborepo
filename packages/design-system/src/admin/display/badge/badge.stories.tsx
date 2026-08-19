import type { Meta, StoryObj } from "@repo/storybook-config/react";

import Badge from "./badge";

const meta = {
  title: "Admin/Display/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "BADGE",
    variant: "default",
    size: "md",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "muted", "outline", "destructive"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Muted = {
  args: {
    variant: "muted",
    children: "MUTED",
  },
} satisfies Story;

export const Outline = {
  args: {
    variant: "outline",
    children: "OUTLINE",
  },
} satisfies Story;

export const Destructive = {
  args: {
    variant: "destructive",
    children: "DESTRUCTIVE",
  },
} satisfies Story;

export const Variants = {
  render: () => {
    const variants = ["default", "muted", "outline", "destructive"] as const;

    return (
      <div className="flex flex-wrap items-center gap-3">
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant.toUpperCase()}
          </Badge>
        ))}
      </div>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    const sizes = ["sm", "md", "lg"] as const;

    return (
      <div className="flex items-center gap-3">
        {sizes.map((size) => (
          <Badge key={size} size={size}>
            {size.toUpperCase()}
          </Badge>
        ))}
      </div>
    );
  },
} satisfies Story;
