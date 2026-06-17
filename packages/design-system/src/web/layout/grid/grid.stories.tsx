import type { Meta, StoryObj } from "@storybook/react-vite";

import Grid from "./grid";

const meta = {
  title: "Web/Layout/Grid",
  component: Grid,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Grid>;

export default meta;

type Story = StoryObj<typeof meta>;

const Box = ({ label }: { label: string }) => {
  return (
    <div className="border-border bg-surface text-foreground rounded-md border p-4 text-sm">
      {label}
    </div>
  );
};

export const Default = {
  render: () => {
    return (
      <div className="bg-background p-6">
        <Grid>
          <Box label="Web Grid 기본값" />
        </Grid>
      </div>
    );
  },
} satisfies Story;

export const Columns = {
  render: () => {
    return (
      <div className="bg-background p-6">
        <Grid columns={3}>
          <Box label="카드 1" />
          <Box label="카드 2" />
          <Box label="카드 3" />
        </Grid>
      </div>
    );
  },
} satisfies Story;

export const ResponsiveColumns = {
  render: () => {
    return (
      <div className="bg-background p-6">
        <Grid columns={1} smColumns={2} mdColumns={3} lgColumns={4}>
          <Box label="콘텐츠 1" />
          <Box label="콘텐츠 2" />
          <Box label="콘텐츠 3" />
          <Box label="콘텐츠 4" />
        </Grid>
      </div>
    );
  },
} satisfies Story;

export const Gaps = {
  render: () => {
    return (
      <div className="bg-background flex flex-col gap-8 p-6">
        <Grid columns={3} gap="sm">
          <Box label="gap=sm" />
          <Box label="gap=sm" />
          <Box label="gap=sm" />
        </Grid>

        <Grid columns={3} gap="lg">
          <Box label="gap=lg" />
          <Box label="gap=lg" />
          <Box label="gap=lg" />
        </Grid>

        <Grid columns={3} gap="xl">
          <Box label="gap=xl" />
          <Box label="gap=xl" />
          <Box label="gap=xl" />
        </Grid>
      </div>
    );
  },
} satisfies Story;

export const Alignment = {
  render: () => {
    return (
      <div className="bg-background p-6">
        <Grid columns={3} align="center" justify="center" className="min-h-40">
          <Box label="center" />
          <Box label="align=center" />
          <Box label="justify=center" />
        </Grid>
      </div>
    );
  },
} satisfies Story;
