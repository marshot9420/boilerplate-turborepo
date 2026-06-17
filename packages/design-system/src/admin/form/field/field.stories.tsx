import type { Meta, StoryObj } from "@storybook/react-vite";

import Field from "./field";

const meta = {
  title: "Admin/Form/Field",
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          "Field는 label, control, help text, error message 등을 배치하는 wrapper입니다. disabled와 hasError는 wrapper 상태 표시용 prop이며, 내부 form control을 자동으로 disabled 처리하거나 aria-invalid 처리하지 않습니다.",
      },
    },
  },
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["vertical", "horizontal"],
    },
    spacing: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    fullWidth: {
      control: "boolean",
    },
    hasError: {
      control: "boolean",
      description:
        "Field wrapper의 invalid 상태 표시용 prop입니다. 내부 form control의 aria-invalid는 직접 전달해야 합니다.",
    },
    disabled: {
      control: "boolean",
      description:
        "Field wrapper의 disabled 상태 표시용 prop입니다. 내부 form control의 disabled는 직접 전달해야 합니다.",
    },
  },
  args: {
    direction: "vertical",
    spacing: "md",
    fullWidth: true,
    hasError: false,
    disabled: false,
  },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <Field {...args} className="max-w-md">
        <label className="text-sm font-medium" htmlFor="admin-field-default">
          제목
        </label>
        <input
          id="admin-field-default"
          className="border-input bg-background h-10 rounded-md border px-3 text-sm"
          placeholder="제목을 입력해 주세요"
          disabled={args.disabled}
          aria-invalid={args.hasError}
        />
      </Field>
    );
  },
};

export const Horizontal: Story = {
  args: {
    direction: "horizontal",
  },
  render: (args) => {
    return (
      <Field {...args} className="max-w-2xl">
        <label className="text-sm font-medium" htmlFor="admin-field-horizontal">
          관리자 메모
        </label>
        <div className="grid gap-2">
          <textarea
            id="admin-field-horizontal"
            className="border-input bg-background min-h-24 rounded-md border px-3 py-2 text-sm"
            placeholder="메모를 입력해 주세요"
            disabled={args.disabled}
            aria-invalid={args.hasError}
          />
          <p className="text-muted-foreground text-xs">내부 관리자에게만 표시되는 메모입니다.</p>
        </div>
      </Field>
    );
  },
};

export const Invalid: Story = {
  args: {
    hasError: true,
  },
  render: (args) => {
    return (
      <Field {...args} className="max-w-md">
        <label className="text-sm font-medium" htmlFor="admin-field-invalid">
          이름
        </label>
        <input
          id="admin-field-invalid"
          className="border-destructive bg-background h-10 rounded-md border px-3 text-sm"
          placeholder="이름을 입력해 주세요"
          aria-invalid="true"
        />
        <p className="text-destructive text-xs">이름을 입력해 주세요.</p>
      </Field>
    );
  },
};

export const Spacing: Story = {
  render: () => {
    return (
      <div className="grid max-w-md gap-6">
        <Field spacing="sm">
          <label className="text-sm font-medium" htmlFor="admin-field-sm">
            Small
          </label>
          <input
            id="admin-field-sm"
            className="border-input bg-background h-10 rounded-md border px-3 text-sm"
          />
        </Field>

        <Field spacing="md">
          <label className="text-sm font-medium" htmlFor="admin-field-md">
            Medium
          </label>
          <input
            id="admin-field-md"
            className="border-input bg-background h-10 rounded-md border px-3 text-sm"
          />
        </Field>

        <Field spacing="lg">
          <label className="text-sm font-medium" htmlFor="admin-field-lg">
            Large
          </label>
          <input
            id="admin-field-lg"
            className="border-input bg-background h-10 rounded-md border px-3 text-sm"
          />
        </Field>
      </div>
    );
  },
};
