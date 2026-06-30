import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import CreateContentSubmitButton from "./create-content-submit-button";

const meta = {
  title: "Features/Content/CreateContentSubmitButton",
  component: CreateContentSubmitButton,
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <CreateContentSubmitButton {...args} />
    </form>
  ),
} satisfies Meta<typeof CreateContentSubmitButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const CustomLabel = {
  args: {
    children: "작성 완료",
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;
