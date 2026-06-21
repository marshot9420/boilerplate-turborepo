import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import DeleteMyAccountSubmitButton from "./delete-my-account-submit-button";

const meta: Meta<typeof DeleteMyAccountSubmitButton> = {
  title: "Features/User/DeleteMyAccountSubmitButton",
  component: DeleteMyAccountSubmitButton,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <form
        action={() => {
          // Storybook preview only.
        }}
      >
        <Story />
      </form>
    ),
  ],
  args: {
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;

export const FullWidth = {
  args: {
    className: "w-64",
  },
} satisfies Story;
