import type { Meta, StoryObj } from "@storybook/react-vite";

import IconButton from "./icon-button";

const meta = {
  title: "Web/Buttons/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  args: {
    "aria-label": "검색",
    children: <span aria-hidden="true">⌕</span>,
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
    shape: {
      control: "select",
      options: ["square", "circle"],
    },
    loading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Outline = {
  args: {
    variant: "outline",
  },
} satisfies Story;

export const Ghost = {
  args: {
    variant: "ghost",
  },
} satisfies Story;

export const Destructive = {
  args: {
    "aria-label": "삭제",
    variant: "destructive",
    children: <span aria-hidden="true">×</span>,
  },
} satisfies Story;

export const Circle = {
  args: {
    shape: "circle",
  },
} satisfies Story;

export const Loading = {
  args: {
    "aria-label": "불러오는 중",
    loading: true,
    children: <span aria-hidden="true">…</span>,
  },
} satisfies Story;

const variants = ["default", "outline", "ghost", "destructive"] as const;
const sizes = ["sm", "md", "lg"] as const;
const shapes = ["square", "circle"] as const;

export const Variants = {
  render: () => {
    return (
      <div className="flex items-center gap-3">
        {variants.map((variant) => (
          <IconButton key={variant} aria-label={variant} variant={variant}>
            <span aria-hidden="true">⌕</span>
          </IconButton>
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
          <IconButton key={size} aria-label={size} size={size}>
            <span aria-hidden="true">⌕</span>
          </IconButton>
        ))}
      </div>
    );
  },
} satisfies Story;

export const Shapes = {
  render: () => {
    return (
      <div className="flex items-center gap-3">
        {shapes.map((shape) => (
          <IconButton key={shape} aria-label={shape} shape={shape}>
            <span aria-hidden="true">⌕</span>
          </IconButton>
        ))}
      </div>
    );
  },
} satisfies Story;
