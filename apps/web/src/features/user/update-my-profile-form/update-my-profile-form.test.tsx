import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ActionResult } from "@repo/core/action";
import { USER, type UserDetailResponse } from "@repo/domain/user/client";

import UpdateMyProfileForm from "./update-my-profile-form";
import type { UpdateMyProfileFormAction } from "./update-my-profile-form";

const reactMock = vi.hoisted(() => ({
  actionState: null as ActionResult<UserDetailResponse> | null,
  formAction: vi.fn(),
}));

const toastMock = vi.hoisted(() => ({
  toastActionResult: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual("react");

  return {
    ...(actual as object),
    useActionState: vi.fn(() => [reactMock.actionState, reactMock.formAction]),
  };
});

vi.mock("@repo/design-system/toast", () => toastMock);

vi.mock("@/constants", () => ({
  URLS: {
    CLIENT: {
      MY_PAGE: "/me",
    },
  },
}));

const user = {
  id: "user-1",
  email: "user@example.com",
  name: "USER",
  avatarUrl: "https://example.com/avatar.png",
  nickname: "user123",
  role: "USER",
  status: "ACTIVE",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  lastLoginAt: "2026-01-03T00:00:00.000Z",
  deletedAt: null,
} satisfies UserDetailResponse;

const actionMock: UpdateMyProfileFormAction = vi.fn();

const routerMock = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

describe("UpdateMyProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    reactMock.actionState = null;
  });

  it("사용자 정보로 수정 폼의 초기값을 렌더링한다", () => {
    render(<UpdateMyProfileForm user={user} action={actionMock} />);

    expect(screen.getByLabelText("닉네임")).toHaveValue(user.nickname);
    expect(screen.getByLabelText("이름")).toHaveValue(user.name);
    expect(screen.getByLabelText("프로필 이미지 URL")).toHaveValue(user.avatarUrl);

    expect(
      screen.getByText(`${user.nickname.length}/${USER.NICKNAME.MAX_LENGTH}`),
    ).toBeInTheDocument();

    expect(screen.getByText(`${user.name.length}/${USER.NAME.MAX_LENGTH}`)).toBeInTheDocument();

    expect(screen.getByText("한글, 영문, 숫자, 밑줄만 사용할 수 있습니다.")).toBeInTheDocument();

    expect(
      screen.getByText("이름을 비워두면 프로필에서 이름이 없음으로 표시됩니다."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("이미지 URL을 비워두면 닉네임 첫 글자가 기본 이미지로 표시됩니다."),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "취소" })).toHaveAttribute("href", "/me");
    expect(screen.getByRole("button", { name: "프로필 수정" })).toBeInTheDocument();

    expect(toastMock.toastActionResult).toHaveBeenCalledWith(null);
  });

  it("입력값을 변경하면 controlled input 값과 글자 수를 갱신한다", async () => {
    const userController = userEvent.setup();

    render(<UpdateMyProfileForm user={user} action={actionMock} />);

    const nicknameInput = screen.getByLabelText("닉네임");
    const nameInput = screen.getByLabelText("이름");
    const avatarUrlInput = screen.getByLabelText("프로필 이미지 URL");

    await userController.clear(nicknameInput);
    await userController.type(nicknameInput, "updated_user");

    await userController.clear(nameInput);
    await userController.type(nameInput, "UPDATED");

    await userController.clear(avatarUrlInput);
    await userController.type(avatarUrlInput, "https://example.com/updated.png");

    expect(nicknameInput).toHaveValue("updated_user");
    expect(nameInput).toHaveValue("UPDATED");
    expect(avatarUrlInput).toHaveValue("https://example.com/updated.png");

    expect(screen.getByText(`12/${USER.NICKNAME.MAX_LENGTH}`)).toBeInTheDocument();
    expect(screen.getByText(`7/${USER.NAME.MAX_LENGTH}`)).toBeInTheDocument();
  });

  it("ActionResult의 form error와 field error를 렌더링한다", () => {
    const actionState = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        nickname: ["닉네임은 2자 이상 입력해 주세요."],
        name: ["이름은 100자 이하로 입력해 주세요."],
        avatarUrl: ["프로필 이미지 URL 형식이 올바르지 않습니다."],
      },
    } satisfies ActionResult<UserDetailResponse>;

    reactMock.actionState = actionState;

    render(<UpdateMyProfileForm user={user} action={actionMock} />);

    expect(screen.getByText("프로필을 수정할 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByText("입력값을 확인해 주세요.")).toBeInTheDocument();

    expect(screen.getByText("닉네임은 2자 이상 입력해 주세요.")).toBeInTheDocument();
    expect(screen.getByText("이름은 100자 이하로 입력해 주세요.")).toBeInTheDocument();
    expect(screen.getByText("프로필 이미지 URL 형식이 올바르지 않습니다.")).toBeInTheDocument();

    expect(screen.getByLabelText("닉네임")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("이름")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("프로필 이미지 URL")).toHaveAttribute("aria-invalid", "true");

    expect(screen.getByLabelText("닉네임")).toHaveAttribute("data-invalid", "true");
    expect(screen.getByLabelText("이름")).toHaveAttribute("data-invalid", "true");
    expect(screen.getByLabelText("프로필 이미지 URL")).toHaveAttribute("data-invalid", "true");

    expect(toastMock.toastActionResult).toHaveBeenCalledWith(actionState);
  });

  it("사용자 이름과 이미지 URL이 null이면 빈 문자열로 렌더링한다", () => {
    render(
      <UpdateMyProfileForm
        user={{
          ...user,
          name: null,
          avatarUrl: null,
        }}
        action={actionMock}
      />,
    );

    expect(screen.getByLabelText("이름")).toHaveValue("");
    expect(screen.getByLabelText("프로필 이미지 URL")).toHaveValue("");
    expect(screen.getByText(`0/${USER.NAME.MAX_LENGTH}`)).toBeInTheDocument();
  });

  it("프로필 수정에 성공하면 마이페이지로 이동하고 refresh 한다", () => {
    const actionState = {
      ok: true,
      data: user,
      message: "프로필이 수정되었습니다.",
    } satisfies ActionResult<UserDetailResponse>;

    reactMock.actionState = actionState;

    render(<UpdateMyProfileForm user={user} action={actionMock} />);

    expect(toastMock.toastActionResult).toHaveBeenCalledWith(actionState);
    expect(routerMock.replace).toHaveBeenCalledWith("/me");
    expect(routerMock.refresh).toHaveBeenCalledTimes(1);
  });
});
