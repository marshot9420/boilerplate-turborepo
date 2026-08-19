import type { Meta, StoryObj } from "@repo/storybook-config/react";

import Section from "./section";

const meta = {
  title: "Admin/Layout/Section",
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
    <div className="border-border bg-surface text-foreground mx-auto max-w-5xl rounded-md border p-6 text-sm shadow-xs">
      {label}
    </div>
  );
};

export const Default = {
  render: () => {
    return (
      <Section>
        <Box label="Admin Section 기본값: spacing=md / surface=none / border=false" />
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

export const Dense = {
  render: () => {
    return (
      <Section spacing="sm" surface="surface" border>
        <Box label="관리자 화면에서 사용하기 좋은 조밀한 섹션" />
      </Section>
    );
  },
} satisfies Story;
