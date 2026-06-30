import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type * as ReactModule from "react";

import type { ActionResult } from "@repo/core/action";

import DeleteMyAccountForm, { type DeleteMyAccountFormAction } from "./delete-my-account-form";

const reactMock = vi.hoisted(() => ({
  useActionState: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof ReactModule>("react");

  return {
    ...actual,
    useActionState: reactMock.useActionState,
  };
});

function createSuccessAction(): DeleteMyAccountFormAction {
  const action = vi.fn(async (): Promise<ActionResult<unknown>> => {
    return {
      ok: true,
      data: null,
      message: "회원 탈퇴가 완료되었습니다.",
    };
  });

  return action;
}

function createFailedActionResult(): ActionResult<unknown> {
  return {
    ok: false,
    code: "VALIDATION_ERROR",
    message: "입력값을 확인해 주세요.",
    fieldErrors: {
      confirmation: ["회원탈퇴를 입력해 주세요."],
    },
  };
}

describe("DeleteMyAccountForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    reactMock.useActionState.mockImplementation((action, initialState) => {
      return [initialState, action];
    });
  });

  it("회원 탈퇴 위험 영역과 확인 입력란을 렌더링한다", () => {
    render(<DeleteMyAccountForm action={createSuccessAction()} />);

    expect(screen.getByText("위험 영역")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "회원 탈퇴",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "회원 탈퇴를 진행하면 계정이 삭제 처리되고 현재 로그인 세션이 종료됩니다. 이 작업은 일반 사용자 화면에서 되돌릴 수 없습니다.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", {
        name: "확인 문구",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("탈퇴 후에는 기존 소셜 로그인 계정으로 다시 로그인할 수 없습니다."),
    ).toBeInTheDocument();
  });

  it("확인 문구를 입력하지 않으면 제출 버튼을 비활성화한다", () => {
    render(<DeleteMyAccountForm action={createSuccessAction()} />);

    expect(
      screen.getByRole("button", {
        name: "회원 탈퇴",
      }),
    ).toBeDisabled();
  });

  it("확인 문구가 정확하면 제출 버튼을 활성화한다", () => {
    render(<DeleteMyAccountForm action={createSuccessAction()} />);

    fireEvent.change(
      screen.getByRole("textbox", {
        name: "확인 문구",
      }),
      {
        target: {
          value: "회원탈퇴",
        },
      },
    );

    expect(
      screen.getByRole("button", {
        name: "회원 탈퇴",
      }),
    ).not.toBeDisabled();
  });

  it("확인 문구 앞뒤 공백은 허용한다", () => {
    render(<DeleteMyAccountForm action={createSuccessAction()} />);

    fireEvent.change(
      screen.getByRole("textbox", {
        name: "확인 문구",
      }),
      {
        target: {
          value: "  회원탈퇴  ",
        },
      },
    );

    expect(
      screen.getByRole("button", {
        name: "회원 탈퇴",
      }),
    ).not.toBeDisabled();
  });

  it("확인 문구가 다르면 제출 버튼을 비활성화한다", () => {
    render(<DeleteMyAccountForm action={createSuccessAction()} />);

    fireEvent.change(
      screen.getByRole("textbox", {
        name: "확인 문구",
      }),
      {
        target: {
          value: "탈퇴",
        },
      },
    );

    expect(
      screen.getByRole("button", {
        name: "회원 탈퇴",
      }),
    ).toBeDisabled();
  });

  it("실패 ActionResult가 있으면 에러 알림과 필드 에러를 렌더링한다", () => {
    reactMock.useActionState.mockImplementation((action) => {
      return [createFailedActionResult(), action];
    });

    render(<DeleteMyAccountForm action={createSuccessAction()} />);

    expect(screen.getByText("회원 탈퇴를 처리할 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByText("입력값을 확인해 주세요.")).toBeInTheDocument();
    expect(screen.getByText("회원탈퇴를 입력해 주세요.")).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", {
        name: "확인 문구",
      }),
    ).toHaveAttribute("aria-describedby");
  });

  it("전달받은 action을 useActionState에 연결한다", () => {
    const action = createSuccessAction();

    render(<DeleteMyAccountForm action={action} />);

    expect(reactMock.useActionState).toHaveBeenCalledWith(action, null);
  });
});
