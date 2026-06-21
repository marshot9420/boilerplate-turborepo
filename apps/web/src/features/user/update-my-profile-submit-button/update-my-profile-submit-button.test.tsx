import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import UpdateMyProfileSubmitButton from "./update-my-profile-submit-button";

const formStatusMock = vi.hoisted(() => ({
  status: {
    pending: false,
  },
}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");

  return {
    ...(actual as object),
    useFormStatus: vi.fn(() => formStatusMock.status),
  };
});

describe("UpdateMyProfileSubmitButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    formStatusMock.status = {
      pending: false,
    };
  });

  it("기본 submit 버튼을 렌더링한다", () => {
    render(<UpdateMyProfileSubmitButton />);

    const button = screen.getByRole("button", {
      name: "프로필 수정",
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeEnabled();
  });

  it("pending 상태이면 대기 문구를 표시하고 버튼을 비활성화한다", () => {
    formStatusMock.status = {
      pending: true,
    };

    render(<UpdateMyProfileSubmitButton />);

    expect(
      screen.getByRole("button", {
        name: "수정 중...",
      }),
    ).toBeDisabled();
  });

  it("children과 pendingText를 변경할 수 있다", () => {
    formStatusMock.status = {
      pending: true,
    };

    render(
      <UpdateMyProfileSubmitButton pendingText="저장 중...">저장하기</UpdateMyProfileSubmitButton>,
    );

    expect(
      screen.getByRole("button", {
        name: "저장 중...",
      }),
    ).toBeDisabled();
  });

  it("disabled가 true이면 pending 상태가 아니어도 버튼을 비활성화한다", () => {
    render(<UpdateMyProfileSubmitButton disabled />);

    expect(
      screen.getByRole("button", {
        name: "프로필 수정",
      }),
    ).toBeDisabled();
  });
});
