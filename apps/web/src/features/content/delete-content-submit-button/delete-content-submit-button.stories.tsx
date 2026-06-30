import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import DeleteContentSubmitButton from "./delete-content-submit-button";

const meta = {
  title: "Features/Content/DeleteContentSubmitButton",
  component: DeleteContentSubmitButton,
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <DeleteContentSubmitButton {...args} />
    </form>
  ),
} satisfies Meta<typeof DeleteContentSubmitButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const CustomLabel = {
  args: {
    children: "삭제하기",
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;
