import { render, screen } from "@testing-library/react";
import type * as ReactDom from "react-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LogoutSubmitButton from "./logout-submit-button";

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

describe("LogoutSubmitButton", () => {
  beforeEach(() => {
    useFormStatusMock.mockReturnValue({
      pending: false,
      data: null,
      method: null,
      action: null,
    });
  });

  it("기본 로그아웃 submit 버튼을 렌더링한다", () => {
    render(
      <form>
        <LogoutSubmitButton />
      </form>,
    );

    const button = screen.getByRole("button", { name: "로그아웃" });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
    expect(button).not.toBeDisabled();
  });

  it("커스텀 라벨을 렌더링한다", () => {
    render(
      <form>
        <LogoutSubmitButton label="나가기" />
      </form>,
    );

    expect(screen.getByRole("button", { name: "나가기" })).toBeInTheDocument();
  });

  it("pending 상태에서는 버튼을 비활성화하고 pending 라벨을 렌더링한다", () => {
    useFormStatusMock.mockReturnValue({
      pending: true,
      data: null,
      method: null,
      action: null,
    });

    render(
      <form>
        <LogoutSubmitButton pendingLabel="처리 중" />
      </form>,
    );

    const button = screen.getByRole("button", { name: "처리 중" });

    expect(button).toBeDisabled();
    expect(screen.getByText("처리 중")).toBeInTheDocument();
  });
});
