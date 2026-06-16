import type { Meta, StoryObj } from "@storybook/react-vite";

import Spinner from "./spinner";

const meta = {
  title: "Admin/Display/Spinner",
  component: Spinner,
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "muted", "inverse"],
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    decorative: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
  },
  args: {
    variant: "default",
    size: "md",
    label: "로딩 중",
    decorative: false,
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Muted = {
  args: {
    variant: "muted",
  },
} satisfies Story;

export const Inverse: Story = {
  args: {
    variant: "inverse",
  },
  decorators: [
    (StoryComponent) => {
      return (
        <div className="bg-primary inline-flex rounded-md p-4">
          <StoryComponent />
        </div>
      );
    },
  ],
};

export const Sizes = {
  render: () => {
    return (
      <div className="flex items-center gap-4">
        <Spinner size="sm" label="작은 로딩 중" />
        <Spinner size="md" label="중간 로딩 중" />
        <Spinner size="lg" label="큰 로딩 중" />
      </div>
    );
  },
} satisfies Story;

export const InButton = {
  render: () => {
    return (
      <button
        type="button"
        className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
      >
        <Spinner size="sm" variant="inverse" decorative />
        저장 중
      </button>
    );
  },
} satisfies Story;
