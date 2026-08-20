import type { Meta, StoryObj } from "@repo/storybook-config/react";

import StatCard, {
  StatCardDescription,
  StatCardFooter,
  StatCardHeader,
  StatCardTitle,
  StatCardTrend,
  StatCardValue,
} from "./stat-card";

const meta = {
  title: "Web/Data Display/StatCard",
  component: StatCard,
  parameters: {
    layout: "centered",
  },
  args: {
    size: "md",
    tone: "default",
    interactive: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    tone: {
      control: "select",
      options: ["default", "muted", "success", "warning", "danger", "info"],
    },
    interactive: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof StatCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  render: (args) => {
    return (
      <div className="w-88 max-w-full">
        <StatCard {...args}>
          <StatCardHeader>
            <StatCardTitle>총 사용자</StatCardTitle>
            <StatCardTrend direction="up">+12%</StatCardTrend>
          </StatCardHeader>
          <StatCardValue>1,024</StatCardValue>
          <StatCardDescription>지난 30일 기준</StatCardDescription>
        </StatCard>
      </div>
    );
  },
} satisfies Story;

export const WithFooter = {
  render: (args) => {
    return (
      <div className="w-88 max-w-full">
        <StatCard {...args}>
          <StatCardHeader>
            <StatCardTitle>전환율</StatCardTitle>
            <StatCardTrend direction="flat">0%</StatCardTrend>
          </StatCardHeader>
          <StatCardValue>8.4%</StatCardValue>
          <StatCardDescription>전월과 동일</StatCardDescription>
          <StatCardFooter>최근 업데이트: 방금 전</StatCardFooter>
        </StatCard>
      </div>
    );
  },
} satisfies Story;

export const Tones = {
  render: () => {
    const tones = ["default", "muted", "success", "warning", "danger", "info"] as const;

    return (
      <div className="grid w-176 max-w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {tones.map((tone) => (
          <StatCard key={tone} tone={tone}>
            <StatCardHeader>
              <StatCardTitle>{tone}</StatCardTitle>
              <StatCardTrend direction={tone === "danger" ? "down" : "up"}>
                {tone === "danger" ? "-4%" : "+12%"}
              </StatCardTrend>
            </StatCardHeader>
            <StatCardValue>1,024</StatCardValue>
            <StatCardDescription>tone: {tone}</StatCardDescription>
          </StatCard>
        ))}
      </div>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    const sizes = ["sm", "md", "lg"] as const;

    return (
      <div className="grid w-176 max-w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {sizes.map((size) => (
          <StatCard key={size} size={size}>
            <StatCardTitle>{size}</StatCardTitle>
            <StatCardValue>128</StatCardValue>
            <StatCardDescription>size: {size}</StatCardDescription>
          </StatCard>
        ))}
      </div>
    );
  },
} satisfies Story;

export const Interactive = {
  args: {
    interactive: true,
  },
  render: (args) => {
    return (
      <div className="w-88 max-w-full">
        <StatCard {...args} tabIndex={0}>
          <StatCardHeader>
            <StatCardTitle>클릭 가능한 카드</StatCardTitle>
            <StatCardTrend direction="up">+8%</StatCardTrend>
          </StatCardHeader>
          <StatCardValue>420</StatCardValue>
          <StatCardDescription>tabIndex를 함께 전달한 예시입니다.</StatCardDescription>
        </StatCard>
      </div>
    );
  },
} satisfies Story;
