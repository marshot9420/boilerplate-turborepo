import type { Meta, StoryObj } from "@storybook/react-vite";

import Avatar from "./avatar";

const avatarSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' fill='%23e5e7eb'/%3E%3Ccircle cx='64' cy='48' r='24' fill='%239ca3af'/%3E%3Cpath d='M24 116c6-25 22-38 40-38s34 13 40 38' fill='%239ca3af'/%3E%3C/svg%3E";

const meta = {
  title: "Admin/Display/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  args: {
    fallback: "M",
    size: "md",
    shape: "circle",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    shape: {
      control: "select",
      options: ["circle", "square"],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Fallback = {} satisfies Story;

export const Image = {
  args: {
    alt: "MARSHOT",
    src: avatarSrc,
  },
} satisfies Story;

export const Square = {
  args: {
    shape: "square",
    fallback: "M",
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    const sizes = ["sm", "md", "lg"] as const;

    return (
      <div className="flex items-center gap-4">
        {sizes.map((size) => (
          <Avatar key={size} fallback={size[0]?.toUpperCase()} size={size} />
        ))}
      </div>
    );
  },
} satisfies Story;

export const WithImages = {
  render: () => {
    const items = ["M", "A", "E"];

    return (
      <div className="flex items-center -space-x-2">
        {items.map((fallback) => (
          <Avatar key={fallback} alt={fallback} fallback={fallback} src={avatarSrc} />
        ))}
      </div>
    );
  },
} satisfies Story;
