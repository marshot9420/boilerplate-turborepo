import type { Meta, StoryObj } from "@storybook/react-vite";

import Container from "./container";

const meta = {
  title: "Web/Layout/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

const Box = ({ label }: { label: string }) => {
  return (
    <div className="border-border bg-surface text-foreground rounded-md border p-6 text-sm">
      {label}
    </div>
  );
};

export const Default = {
  render: () => {
    return (
      <Container>
        <Box label="Web Container 기본값: xl / md / centered=true" />
      </Container>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="bg-background flex flex-col gap-6 py-6">
        <Container size="sm">
          <Box label="size=sm" />
        </Container>

        <Container size="md">
          <Box label="size=md" />
        </Container>

        <Container size="lg">
          <Box label="size=lg" />
        </Container>

        <Container size="xl">
          <Box label="size=xl" />
        </Container>

        <Container size="2xl">
          <Box label="size=2xl" />
        </Container>
      </div>
    );
  },
} satisfies Story;

export const Paddings = {
  render: () => {
    return (
      <div className="bg-background flex flex-col gap-6 py-6">
        <Container padding="none">
          <Box label="padding=none" />
        </Container>

        <Container padding="sm">
          <Box label="padding=sm" />
        </Container>

        <Container padding="md">
          <Box label="padding=md" />
        </Container>

        <Container padding="lg">
          <Box label="padding=lg" />
        </Container>
      </div>
    );
  },
} satisfies Story;

export const NotCentered = {
  render: () => {
    return (
      <Container size="lg" centered={false}>
        <Box label="centered=false" />
      </Container>
    );
  },
} satisfies Story;

export const FullWidth = {
  render: () => {
    return (
      <Container size="full">
        <Box label="size=full" />
      </Container>
    );
  },
} satisfies Story;
