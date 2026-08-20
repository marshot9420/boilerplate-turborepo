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
  title: "Admin/Data Display/StatCard",
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
            <StatCardTitle>TOTAL USERS</StatCardTitle>
            <StatCardTrend direction="up">+12%</StatCardTrend>
          </StatCardHeader>
          <StatCardValue>1,024</StatCardValue>
          <StatCardDescription>Last 30 days</StatCardDescription>
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
            <StatCardTitle>CONVERSION</StatCardTitle>
            <StatCardTrend direction="flat">0%</StatCardTrend>
          </StatCardHeader>
          <StatCardValue>8.4%</StatCardValue>
          <StatCardDescription>No change from last month</StatCardDescription>
          <StatCardFooter>Updated just now</StatCardFooter>
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
              <StatCardTitle>{tone.toUpperCase()}</StatCardTitle>
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
            <StatCardTitle>{size.toUpperCase()}</StatCardTitle>
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
            <StatCardTitle>INTERACTIVE CARD</StatCardTitle>
            <StatCardTrend direction="up">+8%</StatCardTrend>
          </StatCardHeader>
          <StatCardValue>420</StatCardValue>
          <StatCardDescription>Example with tabIndex.</StatCardDescription>
        </StatCard>
      </div>
    );
  },
} satisfies Story;
