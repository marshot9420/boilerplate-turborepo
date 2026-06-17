import type { Meta, StoryObj } from "@storybook/react-vite";

import Section from "./section";

const meta = {
  title: "Web/Layout/Section",
  component: Section,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

const Box = ({ label }: { label: string }) => {
  return (
    <div className="border-border bg-surface text-foreground mx-auto max-w-5xl rounded-md border p-6 text-sm">
      {label}
    </div>
  );
};

export const Default = {
  render: () => {
    return (
      <Section>
        <Box label="Web Section 기본값: spacing=lg / surface=none / border=false" />
      </Section>
    );
  },
} satisfies Story;

export const Spacings = {
  render: () => {
    return (
      <div className="bg-background">
        <Section spacing="sm">
          <Box label="spacing=sm" />
        </Section>

        <Section spacing="md">
          <Box label="spacing=md" />
        </Section>

        <Section spacing="lg">
          <Box label="spacing=lg" />
        </Section>

        <Section spacing="xl">
          <Box label="spacing=xl" />
        </Section>
      </div>
    );
  },
} satisfies Story;

export const Surfaces = {
  render: () => {
    return (
      <div>
        <Section surface="background">
          <Box label="surface=background" />
        </Section>

        <Section surface="surface">
          <Box label="surface=surface" />
        </Section>

        <Section surface="muted">
          <Box label="surface=muted" />
        </Section>
      </div>
    );
  },
} satisfies Story;

export const WithBorder = {
  render: () => {
    return (
      <Section surface="muted" border>
        <Box label="border=true" />
      </Section>
    );
  },
} satisfies Story;

export const HeroLike = {
  render: () => {
    return (
      <Section spacing="xl" surface="background">
        <Box label="공개 웹 페이지의 Hero 영역처럼 넉넉한 섹션" />
      </Section>
    );
  },
} satisfies Story;
