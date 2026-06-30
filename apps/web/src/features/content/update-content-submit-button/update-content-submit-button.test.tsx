import { render, screen } from "@testing-library/react";
import type * as ReactDom from "react-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import UpdateContentSubmitButton from "./update-content-submit-button";

const useFormStatusMock = vi.hoisted(() =>
  vi.fn(() => ({
    pending: false,
    data: null,
    method: null,
    action: null,
  })),
);

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof ReactDom>("react-dom");

  return {
    ...actual,
    useFormStatus: useFormStatusMock,
  };
});

describe("UpdateContentSubmitButton", () => {
  beforeEach(() => {
    useFormStatusMock.mockReturnValue({
      pending: false,
      data: null,
      method: null,
      action: null,
    });
  });

  it("기본 submit 버튼을 렌더링한다", () => {
    render(<UpdateContentSubmitButton />);

    const button = screen.getByRole("button", {
      name: "콘텐츠 수정",
    });

    expect(button).toHaveAttribute("type", "submit");
    expect(button).not.toBeDisabled();
  });

  it("children을 전달하면 버튼 문구로 사용한다", () => {
    render(<UpdateContentSubmitButton>수정 완료</UpdateContentSubmitButton>);

    expect(
      screen.getByRole("button", {
        name: "수정 완료",
      }),
    ).toBeInTheDocument();
  });

  it("pending 상태이면 pendingChildren을 표시하고 비활성화한다", () => {
    useFormStatusMock.mockReturnValue({
      pending: true,
      data: null,
      method: null,
      action: null,
    });

    render(<UpdateContentSubmitButton pendingChildren="저장 중..." />);

    const button = screen.getByRole("button", {
      name: "저장 중...",
    });

    expect(button).toBeDisabled();
  });

  it("disabled가 true이면 pending이 아니어도 비활성화한다", () => {
    render(<UpdateContentSubmitButton disabled />);

    expect(
      screen.getByRole("button", {
        name: "콘텐츠 수정",
      }),
    ).toBeDisabled();
  });
});
