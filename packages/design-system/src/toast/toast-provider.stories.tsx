"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";

import ToastProvider from "./toast-provider";

const meta = {
  title: "Toast/ToastProvider",
  component: ToastProvider,
  argTypes: {
    richColors: {
      control: "boolean",
    },
    closeButton: {
      control: "boolean",
    },
    position: {
      control: "inline-radio",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
    },
  },
  args: {
    richColors: true,
    closeButton: true,
    position: "top-right",
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <>
        <ToastProvider {...args} />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md border px-4 py-2 text-sm"
            onClick={() => toast.success("성공 Toast입니다.")}
          >
            성공 Toast
          </button>

          <button
            type="button"
            className="rounded-md border px-4 py-2 text-sm"
            onClick={() => toast.error("에러 Toast입니다.")}
          >
            에러 Toast
          </button>

          <button
            type="button"
            className="rounded-md border px-4 py-2 text-sm"
            onClick={() =>
              toast("기본 Toast입니다.", {
                description: "설명 텍스트를 함께 표시합니다.",
              })
            }
          >
            설명 Toast
          </button>
        </div>
      </>
    );
  },
};
