import type { Meta, StoryObj } from "@storybook/react-vite";

import Button from "./button";

const meta = {
  title: "Web/Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    dsTheme: "web",
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    fullWidth: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "destructive"],
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
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

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
    children: "Delete",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
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
    children: "Full width button",
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="outline" disabled>
        Outline disabled
      </Button>
      <Button variant="destructive" disabled>
        Destructive disabled
      </Button>
    </div>
  ),
};

export const LightAndDark: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div
        data-ds-theme="web"
        data-ds-mode="light"
        className="border-border bg-background text-foreground rounded-lg border p-4"
      >
        <p className="mb-4 text-sm font-medium">Web Light</p>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <div
        data-ds-theme="web"
        data-ds-mode="dark"
        className="border-border bg-background text-foreground rounded-lg border p-4"
      >
        <p className="mb-4 text-sm font-medium">Web Dark</p>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>
    </div>
  ),
};
