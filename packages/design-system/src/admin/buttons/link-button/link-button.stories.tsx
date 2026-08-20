import type { Meta, StoryObj } from "@repo/storybook-config/react";

import LinkButton from "./link-button";

const meta = {
  title: "Admin/Buttons/LinkButton",
  component: LinkButton,
  parameters: {
    layout: "centered",
  },
  args: {
    href: "#",
    children: "Link Button",
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
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof LinkButton>;

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

export const Disabled = {
  args: {
    disabled: true,
    children: "Disabled",
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
          <LinkButton key={variant} href="#" variant={variant}>
            {variant}
          </LinkButton>
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
          <LinkButton key={size} href="#" size={size}>
            {size}
          </LinkButton>
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
    children: "Full Width Link Button",
  },
} satisfies Story;
