import { render, screen } from "@testing-library/react";
import type * as ReactDomModule from "react-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DeleteMyAccountSubmitButton from "./delete-my-account-submit-button";

const formStatusMock = vi.hoisted(() => ({
  useFormStatus: vi.fn(),
}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof ReactDomModule>("react-dom");

  return {
    ...actual,
    useFormStatus: formStatusMock.useFormStatus,
  };
});

describe("DeleteMyAccountSubmitButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    formStatusMock.useFormStatus.mockReturnValue({
      pending: false,
      data: null,
      method: null,
      action: null,
    });
  });

  it("기본 상태에서는 회원 탈퇴 submit 버튼을 렌더링한다", () => {
    render(<DeleteMyAccountSubmitButton />);

    const button = screen.getByRole("button", {
      name: "회원 탈퇴",
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "false");
  });

  it("pending 상태이면 처리 중 문구를 표시하고 비활성화한다", () => {
    formStatusMock.useFormStatus.mockReturnValue({
      pending: true,
      data: null,
      method: null,
      action: null,
    });

    render(<DeleteMyAccountSubmitButton />);

    const button = screen.getByRole("button", {
      name: "탈퇴 처리 중...",
    });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("disabled가 true이면 비활성화한다", () => {
    render(<DeleteMyAccountSubmitButton disabled />);

    const button = screen.getByRole("button", {
      name: "회원 탈퇴",
    });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("className을 전달할 수 있다", () => {
    render(<DeleteMyAccountSubmitButton className="w-full" />);

    expect(
      screen.getByRole("button", {
        name: "회원 탈퇴",
      }),
    ).toHaveClass("w-full");
  });
});
