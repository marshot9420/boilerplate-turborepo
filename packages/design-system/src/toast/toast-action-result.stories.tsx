"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ActionResult } from "@repo/core/action";

import { toastActionResult } from "./toast-action-result";

function ToastActionResultDemo() {
  const successResult = {
    ok: true,
    data: null,
    message: "저장되었습니다.",
  } satisfies ActionResult<null>;

  const defaultSuccessResult = {
    ok: true,
    data: null,
  } satisfies ActionResult<null>;

  const errorResult = {
    ok: false,
    code: "VALIDATION_ERROR",
    message: "입력값을 확인해 주세요.",
    fieldErrors: {
      title: ["제목을 입력해 주세요."],
    },
  } satisfies ActionResult;

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        className="rounded-md border px-4 py-2 text-sm"
        onClick={() => toastActionResult(successResult)}
      >
        성공 Toast
      </button>

      <button
        type="button"
        className="rounded-md border px-4 py-2 text-sm"
        onClick={() => toastActionResult(defaultSuccessResult)}
      >
        기본 성공 Toast
      </button>

      <button
        type="button"
        className="rounded-md border px-4 py-2 text-sm"
        onClick={() => toastActionResult(errorResult)}
      >
        에러 Toast
      </button>

      <button
        type="button"
        className="rounded-md border px-4 py-2 text-sm"
        onClick={() =>
          toastActionResult(null, {
            successMessage: "완료되었습니다.",
            errorMessage: "다시 시도해 주세요.",
          })
        }
      >
        Null 결과
      </button>
    </div>
  );
}

const meta = {
  title: "Toast/toastActionResult",
  component: ToastActionResultDemo,
  parameters: {
    dsTheme: "web",
  },
} satisfies Meta<typeof ToastActionResultDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
