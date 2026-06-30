import type { ActionResult } from "@repo/core/action";
import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import DeleteMyAccountForm, { type DeleteMyAccountFormAction } from "./delete-my-account-form";

function createSuccessAction(): DeleteMyAccountFormAction {
  return async (): Promise<ActionResult<unknown>> => {
    return {
      ok: true,
      data: null,
      message: "회원 탈퇴가 완료되었습니다.",
    };
  };
}

function createValidationErrorAction(): DeleteMyAccountFormAction {
  return async (): Promise<ActionResult<unknown>> => {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        confirmation: ["회원탈퇴를 입력해 주세요."],
      },
    };
  };
}

function createServiceErrorAction(): DeleteMyAccountFormAction {
  return async (): Promise<ActionResult<unknown>> => {
    return {
      ok: false,
      code: "USER_FORBIDDEN",
      message: "회원 탈퇴를 처리할 권한이 없습니다.",
    };
  };
}

const meta: Meta<typeof DeleteMyAccountForm> = {
  title: "Features/User/DeleteMyAccountForm",
  component: DeleteMyAccountForm,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100vw-2rem,48rem)]">
        <Story />
      </div>
    ),
  ],
  args: {
    action: createSuccessAction(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const ValidationErrorAfterSubmit = {
  args: {
    action: createValidationErrorAction(),
  },
} satisfies Story;

export const ServiceErrorAfterSubmit = {
  args: {
    action: createServiceErrorAction(),
  },
} satisfies Story;
