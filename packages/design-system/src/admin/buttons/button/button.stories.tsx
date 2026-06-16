import type { Meta, StoryObj } from "@storybook/react-vite";

import Button from "./button";

const meta = {
  title: "Admin/Buttons/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Button",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "ghost", "destructive"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    fullWidth: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Outline = {
  args: {
    variant: "outline",
    children: "Outline",
  },
} satisfies Story;

export const Ghost = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
} satisfies Story;

export const Destructive = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
} satisfies Story;

export const Loading = {
  args: {
    loading: true,
    children: "Loading",
  },
} satisfies Story;

export const WithSlots = {
  args: {
    leftSlot: <span aria-hidden="true">+</span>,
    rightSlot: <span aria-hidden="true">⌘S</span>,
    children: "Save",
  },
} satisfies Story;

const variants = ["default", "outline", "ghost", "destructive"] as const;
const sizes = ["sm", "md", "lg"] as const;

export const Variants = {
  render: () => {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {variants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </div>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex items-center gap-3">
        {sizes.map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
      </div>
    );
  },
} satisfies Story;

export const FullWidth = {
  parameters: {
    layout: "padded",
  },
  args: {
    fullWidth: true,
    children: "Full Width Button",
  },
} satisfies Story;
