import type { Meta, StoryObj } from "@storybook/react-vite";

import EmptyState from "./empty-state";

const EmptyIcon = () => {
  return (
    <svg
      aria-hidden="true"
      className="size-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H8.25A2.25 2.25 0 0 0 6 4.5v15A2.25 2.25 0 0 0 8.25 21.75h7.5A2.25 2.25 0 0 0 18 19.5"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75h.008v.008H12v-.008Z" />
    </svg>
  );
};

const meta = {
  title: "Web/Display/EmptyState",
  component: EmptyState,
  args: {
    icon: <EmptyIcon />,
    heading: "콘텐츠가 없습니다",
    headingElement: "h3",
    description: "아직 표시할 콘텐츠가 없습니다.",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "muted", "surface"],
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    fullWidth: {
      control: "boolean",
    },
    headingElement: {
      control: "inline-radio",
      options: ["p", "h2", "h3", "h4"],
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    variant: "default",
    size: "md",
  },
} satisfies Story;

export const Muted = {
  args: {
    variant: "muted",
    heading: "결과가 없습니다",
    description: "다른 조건으로 다시 시도해 주세요.",
  },
} satisfies Story;

export const Surface = {
  args: {
    variant: "surface",
    heading: "아직 콘텐츠가 없습니다",
    description: "새로운 콘텐츠가 등록되면 이곳에 표시됩니다.",
  },
} satisfies Story;

export const WithAction = {
  args: {
    action: (
      <button
        type="button"
        className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-medium"
      >
        다시 시도
      </button>
    ),
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="grid max-w-4xl gap-4">
        <EmptyState
          size="sm"
          icon={<EmptyIcon />}
          heading="Small"
          description="작은 empty state입니다."
        />
        <EmptyState
          size="md"
          icon={<EmptyIcon />}
          heading="Medium"
          description="기본 empty state입니다."
        />
        <EmptyState
          size="lg"
          icon={<EmptyIcon />}
          heading="Large"
          description="큰 empty state입니다."
        />
      </div>
    );
  },
} satisfies Story;
