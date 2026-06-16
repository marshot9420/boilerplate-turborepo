import type { Meta, StoryObj } from "@storybook/react-vite";

import Badge from "./badge";

const meta = {
  title: "Web/Display/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Badge",
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
    children: "Muted",
  },
} satisfies Story;

export const Outline = {
  args: {
    variant: "outline",
    children: "Outline",
  },
} satisfies Story;

export const Destructive = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
} satisfies Story;

export const Variants = {
  render: () => {
    const variants = ["default", "muted", "outline", "destructive"] as const;

    return (
      <div className="flex flex-wrap items-center gap-3">
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
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
            {size}
          </Badge>
        ))}
      </div>
    );
  },
} satisfies Story;
