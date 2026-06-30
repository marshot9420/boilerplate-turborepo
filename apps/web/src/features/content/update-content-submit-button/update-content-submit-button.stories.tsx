import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import UpdateContentSubmitButton from "./update-content-submit-button";

const meta = {
  title: "Features/Content/UpdateContentSubmitButton",
  component: UpdateContentSubmitButton,
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <UpdateContentSubmitButton {...args} />
    </form>
  ),
} satisfies Meta<typeof UpdateContentSubmitButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const CustomLabel = {
  args: {
    children: "수정 완료",
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;
