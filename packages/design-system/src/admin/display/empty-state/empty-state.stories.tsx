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
        d="M20.25 7.5v9.75A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25V7.5m16.5 0A2.25 2.25 0 0 0 18 5.25H6A2.25 2.25 0 0 0 3.75 7.5m16.5 0v.75A2.25 2.25 0 0 1 18 10.5H6a2.25 2.25 0 0 1-2.25-2.25V7.5"
      />
    </svg>
  );
};

const meta = {
  title: "Admin/Display/EmptyState",
  component: EmptyState,
  args: {
    icon: <EmptyIcon />,
    heading: "데이터가 없습니다",
    description: "아직 등록된 항목이 없습니다.",
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
    heading: "검색 결과가 없습니다",
    description: "검색어를 변경하거나 필터를 초기화해 주세요.",
  },
} satisfies Story;

export const Surface = {
  args: {
    variant: "surface",
    heading: "표시할 항목이 없습니다",
    description: "조건에 맞는 관리자 데이터가 없습니다.",
  },
} satisfies Story;

export const WithAction = {
  args: {
    action: (
      <button
        type="button"
        className="border-border bg-surface text-foreground rounded-md border px-3 py-2 text-sm font-medium"
      >
        새 항목 만들기
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
