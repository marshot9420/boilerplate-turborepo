import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { AppError } from "@repo/core/errors";
import type { Result } from "@repo/core/result";
import type { UserDetailResponse } from "@repo/domain/user/client";

import MyProfileView from "./my-profile-view";

const actionMock = vi.hoisted(() => ({
  deleteMyAccountAction: vi.fn(),
}));

vi.mock("@/actions/user", () => actionMock);

vi.mock("@/features/user", () => ({
  DeleteMyAccountForm: ({ action }: { action: unknown }) => (
    <section aria-label="회원 탈퇴 폼">
      <p>{typeof action}</p>
    </section>
  ),
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

describe("MyProfileView", () => {
  it("내 정보 조회에 성공하면 프로필 화면, 수정 링크, 회원 탈퇴 폼을 표시한다", () => {
    const result = {
      ok: true,
      data: user,
    } satisfies Result<UserDetailResponse, AppError>;

    render(<MyProfileView result={result} />);

    expect(screen.getByRole("heading", { name: "내 정보" })).toBeInTheDocument();
    expect(screen.getByText("마이페이지")).toBeInTheDocument();
    expect(
      screen.getByText("현재 로그인된 계정의 기본 정보를 확인할 수 있습니다."),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: user.nickname })).toBeInTheDocument();
    expect(screen.getAllByText(user.email)).toHaveLength(2);

    expect(screen.getByRole("link", { name: "프로필 수정" })).toHaveAttribute("href", "/me/edit");
    expect(screen.getByRole("region", { name: "회원 탈퇴 폼" })).toBeInTheDocument();
  });

  it("내 정보 조회에 실패하면 에러 알림을 표시한다", () => {
    const error = {
      code: "USER_NOT_FOUND",
      message: "사용자를 찾을 수 없습니다.",
    } satisfies AppError;

    const result = {
      ok: false,
      error,
    } satisfies Result<UserDetailResponse, AppError>;

    render(<MyProfileView result={result} />);

    expect(screen.getByText("내 정보를 불러올 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByText(error.message)).toBeInTheDocument();

    expect(screen.queryByRole("heading", { name: "내 정보" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: user.nickname })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "프로필 수정" })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "회원 탈퇴 폼" })).not.toBeInTheDocument();
  });
});
