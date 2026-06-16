import type { Meta, StoryObj } from "@storybook/react-vite";

import Separator from "./separator";

const meta = {
  title: "Web/Display/Separator",
  component: Separator,
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "muted", "strong"],
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    spacing: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg"],
    },
    decorative: {
      control: "boolean",
    },
  },
  args: {
    variant: "default",
    orientation: "horizontal",
    spacing: "md",
    decorative: true,
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  render: (args) => {
    return (
      <div className="max-w-xl">
        <p className="text-sm">상단 콘텐츠</p>
        <Separator {...args} />
        <p className="text-sm">하단 콘텐츠</p>
      </div>
    );
  },
} satisfies Story;

export const Variants = {
  render: () => {
    return (
      <div className="grid max-w-xl gap-6">
        <div>
          <p className="text-sm">Default</p>
          <Separator variant="default" spacing="sm" />
        </div>

        <div>
          <p className="text-sm">Muted</p>
          <Separator variant="muted" spacing="sm" />
        </div>

        <div>
          <p className="text-sm">Strong</p>
          <Separator variant="strong" spacing="sm" />
        </div>
      </div>
    );
  },
} satisfies Story;

export const Vertical = {
  render: () => {
    return (
      <div className="flex h-16 items-center">
        <span className="text-sm">왼쪽</span>
        <Separator orientation="vertical" spacing="md" />
        <span className="text-sm">오른쪽</span>
      </div>
    );
  },
} satisfies Story;

export const NonDecorative = {
  args: {
    decorative: false,
  },
  render: (args) => {
    return (
      <div className="max-w-xl">
        <p className="text-sm">의미 있는 구분선 위 콘텐츠</p>
        <Separator {...args} />
        <p className="text-sm">의미 있는 구분선 아래 콘텐츠</p>
      </div>
    );
  },
} satisfies Story;
