import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";

const meta = {
  title: "Primitives/Button",
  component: Button,

  args: {
    children: "Button",
    variant: "default",
    size: "md",
    disabled: false,
    loading: false,
    fullWidth: false,
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

    loading: {
      control: "boolean",
    },

    leftSlot: {
      control: false,
    },

    rightSlot: {
      control: false,
    },

    onClick: {
      action: "clicked",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithSlots: Story = {
  args: {
    leftSlot: <span>←</span>,
    rightSlot: <span>→</span>,
    children: "Navigate",
  },
};
